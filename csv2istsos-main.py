import csv
import datetime
import json
import os
import procedure
import requests
import subprocess
import time
import unicodecsv
import virtual

# ARPA files constants
CONSTANT_NAME = 'Riepilogo estrazione'
ARPA_TEMP = 'Temperatura'
ARPA_RAINFALL = 'Precipitazione'
ARPA_MEDIA = 'Media'
ARPA_VALORE_CUMULATO = 'Valore Cumulato'

# istSOS URNs
URN_ISTSOS_TIME = 'urn:ogc:def:parameter:x-istsos:1.0:time:iso8601'
URN_ISTSOS_TEMP = 'urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature'
URN_ISTSOS_RAIN = 'urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall'
URN_ISTSOS_TEMP_QI = 'urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature:qualityIndex'
URN_ISTSOS_RAIN_QI = 'urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall:qualityIndex'

# Datetime formats
ISTSOS_DATETIME_FORMAT = '%Y-%m-%dT%H:%M:%S.000000+0000'
ISTSOS_DATETIME_FILENAME_FORMAT = '%Y%m%d%H%M%S000'
ARPA_DATETIME_FORMAT = '%Y/%m/%d %H:%M'

# Service URL
SERVICE_URL = "http://localhost/istsos/wa/istsos/services"

def read_file(filename):
    with open(filename, 'rb') as file:
        return file.readlines()


def read_csv(filename):
    with open(filename, 'rb') as file:
        reader = unicodecsv.DictReader(file)
        return list(reader)

def change_datetime_format(date):
    return datetime.datetime.strptime(date, ARPA_DATETIME_FORMAT).strftime(ISTSOS_DATETIME_FORMAT)

def get_dateTime_now():
    timestamp = time.time()
    return datetime.datetime.fromtimestamp(timestamp).strftime(ISTSOS_DATETIME_FILENAME_FORMAT)

def processMetadataFile(dir):
    for file in os.listdir(dir):
        if file.endswith('Legenda.txt'):
            filename = dir + file
            metadata_file = read_file(filename)

    index_summary = [i for i, s in enumerate(metadata_file) if CONSTANT_NAME in s]

    # Metadata located in indexes 'index_summary' + 1 and 'index_summary' + 3
    # So far I just need to identify the type of measurement (Temperature, rainfall)
    metadata = unicodecsv.DictReader(metadata_file[index_summary[0] + 1: index_summary[0] + 3])
    for i in metadata:
        observedProperty = i['Nome_Sensore']

    return observedProperty

def processDataFile(wdir, observedProperty, procedureName):
    for file in os.listdir(wdir):
        if file.startswith('RW') and file.endswith('.csv'):
            filename = wdir + file
            data_file = read_csv(filename)

    # Trim key names
    for row in data_file:
        for key, value in row.items():
            auxkey = key.lstrip().rstrip()
            row[auxkey] = row.pop(key)

    observations_filename = procedureName + '_' + get_dateTime_now() + '.dat'
    with open(wdir + observations_filename, 'wb') as file:
        try:
            writer = csv.writer(file)
            if observedProperty == ARPA_TEMP:
                writer.writerow((URN_ISTSOS_TIME, URN_ISTSOS_TEMP))
                key = ARPA_MEDIA
            elif observedProperty == ARPA_RAINFALL:
                writer.writerow((URN_ISTSOS_TIME, URN_ISTSOS_RAIN))
                key = ARPA_VALORE_CUMULATO
            else:
                raise RuntimeError('Observed property not recognized')
            for i in data_file:
                datetime_istsos = change_datetime_format(i['Data-Ora'])
                writer.writerow((datetime_istsos, i[key]))
        finally:
            file.close()

def createProcedure(serviceName):
    service = {
	    "service": serviceName
    }

    print " Create new service"
    # create service
    r = requests.post(SERVICE_URL, data=json.dumps(service))
    print r.text

    procedure.insert_procedure(SERVICE_URL, service['service'])
    virtual.insert_virtual(SERVICE_URL, service['service'])

    # missing
    # load data to db

    # cp FAO56 script to virtual folder
    #os.system("sudo cp ../vp/")

    print " Terminated :)"

def insertObservations(procedureName, server, serviceName, wdir, user, password):
    try:
        print '\n---> Inserting observations'
        os.chdir('/usr/local/istsos/')          
        os.system('python scripts/csv2istsos.py -p ' + procedureName + ' -u ' + server + ' -s ' + serviceName + ' -w ' + wdir + ' -user ' + user + ' -password ' + password)
    except Exception as ex:
        print ex
        #if 'Description of procedure ' + procedureName + ' can not be loaded' in ex.args:
            #print '\n\nCREATING ' + procedureName + ' PROCEDURE'
            #createProcedure(serviceName)
            #insertObservations(procedureName, server, serviceName, wdir, user, password)
    except OSError as oserror:
        print oserror
    except ImportError as imerror:
        print imerror

if __name__ == '__main__':
    server = 'http://localhost/istsos'
    wdir = '/home/felipe/data/MI_Lambrate_Temperatura/'
    serviceName = 'test'
    procedureName = 'Milano'
    user = 'admin'
    password = 'polis0s2016'

    observedProperty = processMetadataFile(wdir)
    processDataFile(wdir, observedProperty, procedureName)
    insertObservations(procedureName, server, serviceName, wdir, user, password)
