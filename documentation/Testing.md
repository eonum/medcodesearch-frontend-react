# Testkonzept Projekt MedCodeSearch 3.0

## Unit Tests

Unit-Tests werden automatisiert mit *Jest* und der *React-Testing-Library* für React. 
Die Unit-Tests sind lediglich isolierte Tests die dafür zuständig sind, ob die Komponenten korrekt dargestellt sind.
## Datenbank Tests

In diesem Projekt werden keine Datenbank-Tests durchgeführt, da von uns keine Datenbank aufgesetzt wurde. Es wird ausschliesslich auf die *Eonum-API* zugegriffen (Dieselbe API wie MedCodeSearch 2.0). Diese API zu testen liegt in der Verantwortung von *Eonum*. Falls aber von unserer Seite her Fehler in der API festgestellt werden, werden diese an *Eonum* weitergeleitet. In der Regel werden diese Fehler zeitnah beseitigt.

## Installationstests

Die Applikation wird am Ende jeder Iteration auf eine Github-Page publiziert. So kann überprüft werden, dass die Installation funktioniert. Ausserdem wird die Installation auf verschiedenen Server-Umgebungen (Apache, nginx) durchgeführt, um die entsprechende Konfiguration zu testen.

## GUI Tests

Der Hauptteil der Tests sind GUI-Tests und werden mittels Selenium IDE und/oder durch nach Jest exportierete Dateien durchgeführt.

## Usability Tests

Die künftigen Benutzer der Software werden primär medizinisches Personal (Ärzte, Spitalpersonal) und sonstige interessierten fachkundigen Personen sein. Die Benutzer verfügen in der Regel über eine medizinische Ausbildung oder zumindest medizinische Kenntnisse. Erklärungen zu den in der Applikation verwendeten medizinischen Fachbegriffe sind deshalb nicht notwendig.

Usability-Tests werden mithilfe von Kodierern und anderem medizinischen Personal durchgeführt. Dabei werden vorgängig einige Szenarien entworfen (z.B. "Suchen Sie im neuesten CHOP-Katalog nach dem Begriff 'Blinddarmentzündung'"), welche die Probanden dann durchspielen müssen. Resultate und Erkenntnisse aus den Tests werden schriftlich festgehalten und allfällige Verbesserungen so rasch wie möglich in die Applikation eingearbeitet.