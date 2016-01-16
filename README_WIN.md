## Hardware
* Windows-Rechner
* 1-Wire Usb Adapter (DS9490R)
* Thermometer (DS18B20) mit RJ11-Stecker
* Malz, Hopfen, ....  

## Funktionalität
Monitorung der Themperaturen ohne Unterstützung der Steuerung (Heizung), da keine GPIOs verwendet werden.  
## Anpassung für Installation auf Windows
### Cygwin downloaden und installieren 
https://cygwin.com/install.html  
Package: libusb1.0: USB Library 
### libusb-win32 downloaden und installieren
http://sourceforge.net/projects/libusb-win32/files/?source=navbar  
entpacken nach C:\Programme\
### owfs downloaden und installieren
http://sourceforge.net/projects/owfs/files/latest/download?source=files  
-> owfs_3.0p2.exe installieren Komponente Bonjour nicht auswählen  
Wichttige Infos zu owfs unter http://owfs.org/index.php?page=ms-windows  
Wie in http://owfs.org/index.php?page=windows-usb beschrieben:  
keine Maxim-Treiber installieren bzw. diese deinstallieren  
aus C:\cygwin\bin cyggcc_s-1.dll und cygncurses-10.dll nach C:\Programme\OWFS\bin kopieren  
### 1-Wire Usb Adapter und Thermometer einstecken und Treiber installieren
C:\Programme\OWFS\drivers  
libusb0.sys aus C:\Programme\libusb-win32-bin-1.2.6.0\bin\x86  
cygusb0.dll aus C:\Programme\OWFS\bin
### Test der 1-Wire-Installation
OW-Server starten: C:\Programme\OWFS\bin\owserver.exe -u -p 3000 --timeout_volatile=2  
OW-Webserver starten: C:\Programme\OWFS\bin\owhttpd.exe -s 3000 -p 3001  
Im Browser 1-Wire Geräte anzeigen: http://127.0.0.1:3001/  
owdir testen:  C:\Programme\OWFS\bin\owdir.exe -s 3000 /  
owread testen:   C:\Programme\OWFS\bin\owread -s :3000 /_SensorID_/temperature  
_SensorID_ anpassen, z.B. 28.6B182B450012

### Python 2.7.10 downloaden und installieren
https://www.python.org/downloads/  
-> python-2.7.10.msi installieren  
Standardordner (C:\Python27\) übernehmen  
Umgebungsvariable PATH erweitern ;C:\Python27
### Git-1.9.5 downloaden und installieren 
http://git-scm.com/download/win  
-> Git-2.6.3-32-bit.exe  starten  
Standardordner (C:\Programme\Git) übernehmen  
Umgebungsvariable PATH erweitern ;C:\Programme\Git\cmd
### Microsoft Visual C++ Compiler for Python 2.7 downloaden und installieren
https://www.microsoft.com/en-us/download/details.aspx?id=44266  
Umgebungsvariable PATH erweitern ;C:\Programme\Gemeinsame Dateien\Microsoft\Visual C++ for Python\9.0  
###  Installation CraftBeerPI_Win
mkdir c:\Bier\  
cd c:\Bier\  
Download zip von https://github.com/homawa/craftbeerpi/tree/2.01_WIN und in C:\Bier entpacken oder mit git clonen  
cd C:\Bier\craftbeerpi  
C:\Python27\Scripts\pip install -r requirements.txt   
python runserver.py  
http://localhost:5000 im Browser aufrufen
