# MedCodeSearch – Installation Manual



# 1 Testing Installation

## 1.1 Download von Jest und React Testing Library 
Falls nach dem Installieren von *Node* mithilfe von `npm install` *Jest* und *React Testing Library* nicht mitinstalliert wurden,
muss noch *Jest* mithilfe von `npm install --save-dev jest`  und noch *React Testing Library* mithilfe von `` installiert werden.

## 1.2 Download von Selenium
Für das GUI-Testing wird Selenium verwendet.
Es gibt zwei Methoden um das Projekt mit Selenium zu Testen:
1. Selenium IDE
2. Aus Selenium IDE exportierte Dateien laufen zu lassen.

Für 1. muss das ADD-ON für den Browser heruntergeladen werden.
- [ ] Für Firefox unter dem Link https://addons.mozilla.org/en-GB/firefox/addon/selenium-ide/
- [ ] Für Chrome unter dem Link https://chrome.google.com/webstore/detail/selenium-ide/mooikfkahbdckldjjndioackbalphokd
- [ ] Für Edge unter dem Link https://microsoftedge.microsoft.com/addons/detail/selenium-ide/ajdpfmkffanmkhejnopjppegokpogffp
- [ ] Für Safari wird kein ADD-ON benötigt, es reicht, wenn man lediglich auf Safari -> Preferences -> Advanced auf die Checkbox mit dem Label 'Show Develop menu' drückt.


Für 2. muss der WEBDriver heruntergeladen werden mit `npm install selenium-webdriver` installiert werden und zusätzlich der für den Browser verwendete spezifische WEBdriver im Pfad entpackt werden. Hierfür folgen Sie der Anleitung aus `https://www.selenium.dev/documentation/webdriver/getting_started/install_drivers/`.

Für weitere Informationen zur installation von Selenium wenden Sie sich an die Dokumentation von Selenium direkt unter dem Link https://www.selenium.dev/

## 1.3 Testing

### 1.3.1 Testing mit Selenium IDE

### 1.3.2 Testing direkt im Code
Mit dem Befehl (innerhalb des richtigen Ordners) `npm install` lässt sich einen automatisierten Testdurchgang starten.
Bevor dies allerdings gemacht wird, muss innerhalb der Datei ``setupTests.js`` der Browser zu dem bevorzugten WEBdriver gewechselt werden. Als Standart Browser ist "Firefox" eingetragen. Man kann auswählen zwischen Firefox, Chrome, Safari und MicrosoftEdge.

