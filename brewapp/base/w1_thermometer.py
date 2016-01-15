import os
from subprocess import Popen, PIPE, call
from random import randint, uniform
from brewapp import app
from decimal import Decimal, ROUND_HALF_UP
import shlex

def initWsWin():
    if app.brewapp_owWin == True:
        try:
            cmd ='C:/Programme/OWFS/bin/owserver.exe -u -p 3000 --timeout_volatile=2'
            args = shlex.split(cmd)
            spipe = Popen(args, stdout = True)
        except:
            print  "     -->Start owserver.exe failed"
 
    
def getW1Thermometer():
    if app.brewapp_owWin == True:
       try:
           arr = []
           SensorTypesAllowed = ["DS18B20"]
           MaxSensors = 4

           pipe = Popen(["C:\\Programme\\OWFS\\bin\\owdir", "-s", ":3000","/"], shell=False,stdout=PIPE)
           result = pipe.communicate()[0].split('\n')
           i = 0
           while i <= MaxSensors:
               if len(result[i]) == 16:
                   pipe = Popen(["C:\\Programme\\OWFS\\bin\\owread", "-s", ":3000", result[i] + "/type"], shell=False,stdout=PIPE)                
                   if pipe.communicate()[0] in SensorTypesAllowed:
                       arr.append(result[i])
                   else:
                       i = MaxSensors
                   i = i + 1    
           print 'gefunden:' + str(arr)
           return arr
       except:
           return ["DummySensor1","DummySensor2"]


def tempData1Wire(tempSensorId):
    try:
        ## Test Mode
        if(tempSensorId == None or tempSensorId == ""):
            return -1
        if (app.testMode == True):
            pipe = Popen(["cat","w1_slave"], stdout=PIPE)
        else:
            if app.brewapp_owWin == True:
                pipe = Popen(["C:\\Programme\\OWFS\\bin\\owread", "-s", ":3000",tempSensorId + "/temperature"], shell=False,stdout=PIPE)
            else:
                pipe = Popen(["cat","/sys/bus/w1/devices/w1_bus_master1/" + tempSensorId + "/w1_slave"], stdout=PIPE)
        result = pipe.communicate()[0]

        if app.brewapp_owWin == True:
            temp_C = float(result)
            print str(temp_C)
        else:
            ## parse the file
            if (result.split('\n')[0].split(' ')[11] == "YES"):
                temp_C = float(result.split("=")[-1])/1000 # temp in Celcius
            else:
                temp_C = -99 #bad temp reading
    except Exception as e:
       temp_C = -99

    return float(format(temp_C, '.2f'))
