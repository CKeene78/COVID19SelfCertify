# COVID19SelfCertify

COVID-19 Self-Certify app written in Javascript with VueJS v2 and an API. This is the front end; the decision (Azure Functions), alerting (Twilio/Outlook), and storing (SharePoint) pieces are not included.

Basic flow:
Index.html contails all of the "pages", organized into section tags. All of the sections are hidden with one, depending on variables tracked within VueJS variables, being displayed at a time.
