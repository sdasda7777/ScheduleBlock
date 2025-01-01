// This is object containing all text of the user interface, to allow for translations.
// Translating the user interface into new language should not require changing anything else.
const INTERFACE_STRINGS = {
	// The key 0 contains names of the languages, for use in the language combobox.
	// The order must be: english first
	// 		(since it is the language this project is developed in, and if
	//			translations are missing, they will default to english),
	//   and then all other languages ordered by Unicode values of the characters.
	// At all following keys, the translations must be at the same index
	//	 as the name of the language.

	0: ["english",
		 "čeština"],
	1: ["OK",
		"Budiž"],
	2: ["Cancel",
		"Zrušit"],
	3: ["Settings",
		"Nastavení"],
	4: ["Save",
		"Uložit"],

	// These keys belong to the controls at the top of the page
	101: ["Language:",
			"Jazyk:"],
	102: ["Background color:",
			"Barva pozadí:"],
	103: ["Import settings",
			"Importovat nastavení"],
	104: ["Export settings",
			"Exportovat nastavení"],
	105: ["Check period (in seconds):",
			"Perioda kontrol (v sekundách):"],
	106: ["Credits:",
			"Autoři/práva:"],
	107: ["Lock Screen Base URL:",
			"URL zamykací obrazovky:"],
	108: ["Note: This should be a domain you have large amount of trust in. It also should not be in your block list and preferably should be lightweight. Honestly, unless you have a really good reason just leave it as it is (default: https://www.iana.org).",

			"Poznámka: Mělo by se jednat o doménu, ve kterou máte velkou důvěru. Také by neměla být na vašem seznamu blokovaných stránek a měla by být jednoduchá (lightweight). Pokud nemáte dobrý důvod, raději ji neměnte (defaultně: https://www.iana.org)."],

	150: ["Must be valid regular expression",
			"Musí být platný regulární výraz"],
	151: ["Must be valid URL including ://",
			"Musí být platná URL včetně ://"],

	// These keys belong to the main table and controls around and in it
	201: ["Enter websites, times when you want them blocked, and where you want them to redirect you (the term soft lock refers to a state when only new tabs cannot be opened, the term hard lock refers to state when even already open tabs will be redirected):",

			"Zadejte stránky, časy, ve které je chcete mít zablokované a kam chcete být přesměrováni (pojem nenavštívitelnost odkazuje na stav, kdy pouze nepůjde otevřít nové karty, pojem znepřístupnění odkazuje na stav, kdy i již otevřené karty budou přesměrovány):"],

	210: ["#",
			"#"],
	211: ["Regular expression (RegEx)",
			"Regulární výraz (RegEx)"],
	212: ["Soft locked hours/days",
			"Časy nenavštívitelnosti"],
	213: ["Hard locked hours/days",
			"Časy znepřístupnění"],
	214: ["Timeouts",
			"Časovače"],
	215: ["Action",
			"Akce"],

	216: ["Close window",
			"Zavřít okno"],
	217: ["Redirect to",
			"Přesměrovat na"],
	218: ["Custom code",
			"Vlastní kód"],
	219: ["Redirect to lock page",
			"Přesměrovat na zamykací stránku"],

	249: ["Delete",
			"Odstranit"],
	250: ["Edit",
			"Upravit"],

	301: ["Must be time intervals in 24 hour format separated by commas. "+
			"Groups of intervals for individual days may be separated with |. ",

			"Musí být časové intervaly v 24-hodinovém formátu oddělené čárkami. "+
			"Skupiny intervalů na jednotlivé dny mohou být oddělené symbolem |. "],

	302: ["Must be pair of allowed time and timeout time separated by a '/' sign, such as  '1:00/1:00:00' (one minute allowed then one hour forbidden). " +
			"Intervals when timeouts apply separated with ';' may follow after '@' sign, days may be separated with '|' sign.",

			"Musí být dvojice povolené a zakázané časové doby oddělené pomocí '/', například '1:00/1:00:00' (jedna povolená minuta poté jedna zakázaná hodina). " +
			"Po znaku '@' mohou následovat hodinové intervaly, kdy pravidlo platí oddělené ';'. Jednotlivá pravidla mohou být oddělena znakem ',', jednotlivé dny znakem '|'."],

	305: ["There is no way to retrieve deleted record, other than importing already exported settings or creating it again. " +
			"Are you absolutely sure you want to delete the record \n" +
			"{0}\n" +
			"from the list?",

			"Neexistuje žádný způsob jak obnovit smazaný záznam, kromě obnovení z dříve exportované zálohy nebo nového vytvoření. " +
			"Jste si naprosto jisti, že chcete vymazat záznam \n" +
			"{0}\n" +
			"ze seznamu pravidel?"],

	349: ["Website that you want to be blocked",
			"Webová stránka, kterou chcete zablokovat"],
	350: ["Regular expression that matches the site you want to be blocked",
			"Regulární výraz objímající stránky, které chcete zablokovat"],
	351: ["Add to the list",
			"Přidat na seznam"],

	// These keys belong to the pattern tester
	401: ["Regular expression tester",
			"Tester regulárních výrazů"],
	402: ["Regular expression to test",
			"Regulární výraz k otestování"],
	403: ["Website to test against",
			"Webová stránka k otestování"],

	411: ["Check",
			"Otestovat"],
	421: ["Result:",
			"Výsledek:"],
	422: ["Not matching",
			"Nevyhovuje"],
	423: ["Matching",
			"Vyhovuje"],
	424: ["Invalid RegEx",
			"Neplatný RegEx"],
};

export class TranslationProvider {
	construct() {
		this.languageIndex = 0;
	}

	getStringVersions(messageCode) {
		return INTERFACE_STRINGS[messageCode];
	}

	setLanguageIndex(newLangIndex) {
		this.languageIndex = newLangIndex;
	}

	getTranslatedString(messageCode) {
		let versions = this.getStringVersions(messageCode)

		if(versions == undefined)
			return false;
		if(this.languageIndex < versions.length && versions[this.languageIndex] != "")
			return versions[this.languageIndex];
		return versions[0];
	}
}