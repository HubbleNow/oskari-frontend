Oskari.registerLocalization(
{
    "lang": "sv",
    "key": "MyPlacesImport",
    "value": {
        "title": "Eget dataset",
        "desc": "Du kan importera dina egna dataset i shape-, gpx- eller mif/mid filformat i zip-paketet eller kmz filformat.",
        "tool": {
            "tooltip": "Importera ditt eget dataset"
        },
        "flyout": {
            "title": "Dataset importering",
            "description": "Importera en datamängd från din dator som en zip-fil, vilken innehåller alla erforderliga filer utav ett av de följande filformatsalternativen:<ul><li>Shapefile (.shp, .shx och .dbf, frivilligt .prj och .cpg)</li><li>GPX (.gpx)</li><li>MapInfo (.mif och .mid)</li><li>Google Map (.kml eller .kmz)</li></ul>Zip-filen kan innehålla endast en datamängd och dess storlek kan vara högst {maxSize, number} Mb.",
            "help": "Importera en datamängd från din dator som ett zip-paket. Var vänlig och kontrollera, att alla filerna är i ett lämpligt filformat och koordinatsystem.",
            "actions": {
                "cancel": "Avbryt",
                "next": "Nästa",
                "close": "Stäng",
                "submit": "Skicka"
            },
            "layer": {
                "title": "Spara dataset information:",
                "name": "Namnge kartlagret",
                "desc": "Beskrivning",
                "source": "Datakälla",
                "style": "Dataset stil definitioner:"
            },
            "validations": {
                "error": {
                    "title": "Fel",
                    "message": "Filen har inte valts och namnet på kartlagret saknas."
                }
            },
            "finish": {
                "success": {
                    "title": "Importering av dataset lyckades.",
                    "message": "Dataset importerade med {count, plural, one {# objekt} other {# objekt}}. Du kan hitta kartlagret i menyn \"Mina uppgifter\"."
                },
                "failure": {
                    "title": "Dataset importen lyckades inte. Försök på nytt senare."
                }
            },
            "error":{
                "title": "Importerningen av datamängden misslyckades.",
                "unknown_projection": "Datamängdens koordinatsystem kunde inte identifieras. Kontrollera att datamängden är antingen i kartans koordinatsystem eller försäkra, att datamängden innehåller de nödvändiga uppgifterna av koordinatsystemet.",
                "invalid_file": "Lämpliga filer för importeringen kunde inte hittas från zip-filen. Var vänlig och kontrollera att filformatet understött och att datamänderna är packade till en zip-fil.",
                "has_foders": "Tarkasta ettei tiedostot ole zip-tiedostossa kansion sisällä.",
                "too_many_files": "Zip-tiedosto sisälsi ylimääräisiä tiedostoja. Poista ylimääräiset tiedostot ja jätä vain tarvittavat ohjeiden mukaiset tiedostot.",
                "multiple_extensions": "Tiedostosta löytyi useita samalla {extension}-tiedostopäätteellä olevia tiedostoja. Tiedosto voi sisältää vain yhden aineiston tiedostot.",
                "multiple_main": "Tiedostosta löytyi useita aineistoja. Tiedosto voi sisältää vain yhden aineiston tiedostot.",
                "unable_to_store_data": "Objekten kunde inte sparas till databasen eller den inmatade datamängden innehöll inga objekt.",
                "short_file_prefix": "Hämtningen av datamängderna från zip-filen misslyckades. Kontrollera, att prefixerna av de packade filerna innehåller åtminstone tre tecken.",
                "file_over_size": "Den valda filen är för stor. Den högsta tillåtna storleken är {maxSize, number} Mb.",
                "malformed": "Kontrollera, att filnamnen inte innehåller diakritiska tecken (t.ex. bokstäverna Å,Ä,Ö).",
                "KMLParser": "Ett kartlager kunde inte skapas från KML-filen.",
                "SHPParser": "Ett kartlager kunde inte skapas från SHP-filen.",
                "MIFParser": "Ett kartlager kunde inte skapas från MIF-filen.",
                "GPXParser": "Ett kartlager kunde inte skapas från GPX-filen.",
                "timeout": "Importeringen av datamändgen kunde inte slutföras på grund av tidutlösning.",
                "abort": "Importeringen av datamängden avbröts.",
                "parsererror": "Datamängden kunde inte behandlas.",
                "generic": "Ett okänt fel uppstod i systemet. Importerningen av datamängden misslyckades."
            },
            "warning":{
                "features_skipped":"OBS! {count, plural, one {# objekt} other {# objekt}} objekt övergavs vid importeringen på grund av saknande eller felaktiga koordinater eller geometri."
            }
        },
        "tab": {
            "title": "Dataset",
            "editLayer": "Redigera kartlagret",
            "deleteLayer": "Ta bort kartlagret",
            "grid": {
                "name": "Namn",
                "description": "Beskrivning",
                "source": "Datakälla",
                "edit": "Redigera",
                "editButton": "Redigera",
                "remove": "Ta bort",
                "removeButton": "Ta bort"
            },
            "confirmDeleteMsg": "Vill du ta bort \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "save": "Spara",
                "cancel": "Avbryt",
                "delete": "Ta bort",
                "close": "Stäng"
            },
            "notification": {
                "deletedTitle": "Ta bort dataset",
                "deletedMsg": "Datasetet har tagits bort",
                "editedMsg": "Datasetet har uppdaterats"
            },
            "error": {
                "title": "Fel!",
                "generic": "Systemfel. Försök på nytt senare.",
                "deleteMsg": "Systemfel. Försök på nytt senare.",
                "editMsg": "Uppdateringen av datasetet misslyckades på grund av ett fel i systemet. Försök på nytt senare.",
                "getStyle": "Sökningen av den stil som definierats för datasetet misslyckades. På blanketten visas utgångsvärdena. Byt värdena för stilen som definierats för datasetet innan du lagrar ändringarna.",
                "styleName": "Namnge kartlagret och försök sedan på nytt."
            }
        },
        "layer": {
            "organization": "Egna dataset",
            "inspire": "Egna dataset"
        }
    }
});
