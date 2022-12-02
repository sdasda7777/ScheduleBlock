// This is object containing all text of the user interface, to allow for translations.
// Translating the user interface into new language should not require changing anything else.
export class TranslationProvider {
	construct(){
		this.languageIndex = 0;
	}

	getStringVersions(messageCode){
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
			
			
			// These keys belong to the main table and controls around and in it
			201: ["Enter websites, times when you want them blocked, and where you want them to redirect you (the term soft lock refers to a state when only new tabs cannot be opened, the term hard lock refers to state when even already open tabs will be redirected):",
			
					"Zadejte stránky, časy, ve které je chcete mít zablokované a kam chcete být přesměrováni (pojem nenavštívitelnost odkazuje na stav, kdy pouze nepůjde otevřít nové karty, pojem znepřístupnění odkazuje na stav, kdy i již otevřené karty budou přesměrovány):"],
		
			210: ["#",
					"#"],
			211: ["Regular expression",
					"Regulární výraz"],
			212: ["Soft locked hours/days",
					"Časy nenavštívitelnosti"],
			213: ["Hard locked hours/days",
					"Časy znepřístupnění"],
			214: ["Timeouts",
					"Časovače"],
			215: ["Action",
					"Akce"],
			216: ["Edit",
					"Upravit"],
			217: ["Delete",
					"Odstranit"],

		
			301: ["Must be time intervals in 24 hour format separated by commas. "+
					"Groups of intervals for individual days may be separated with |. ",
					
					"Musí být časové intervaly v 24-hodinovém formátu oddělené čárkami. "+
					"Skupiny intervalů na jednotlivé dny mohou být oddělené symbolem |. "],
			
			302: ["Must be pair of allowed time and timeout time separated by a '/' sign, such as  '1:00/1:00:00' (one minute allowed then one hour forbidden). " +
					"Intervals when timeouts apply separated with ';' may follow after '@' sign, days may be separated with '|' sign.",
					
					"Musí být dvojice povolené a zakázané časové doby oddělené pomocí '/', například '1:00/1:00:00' (jedna povolená minuta poté jedna zakázaná hodina). " + 
					"Po znaku '@' mohou následovat hodinové intervaly, kdy pravidlo platí oddělené ';'. Jednotlivá pravidla mohou být oddělena znakem ',', jednotlivé dny znakem '|'."],
			305: ["There is no way to retrieve deleted record, other than importing exported settings or creating it again. " +
					"Are you absolutely sure you want to delete the record \n" + 
					"('{0}' => '{1}' @ (s'{2}' | h'{3}'))\n" +
					"from the list?",
					
					"Neexistuje žádný způsob jak obnovit jednou smazaný záznam, kromě obnovení z exportované zálohy nebo nového vytvoření. " +
					"Jste si naprosto jisti, že chcete vymazat záznam \n" +
					"('{0}' => '{1}' @ (s'{2}' | h'{3}'))\n" +
					"ze seznamu pravidel?"],
			
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
			404: ["Result:",
					"Výsledek:"],
			405: ["Not matching",
					"Nevyhovuje"],
			406: ["Matching",
					"Vyhovuje"],
			407: ["Check",
					"Otestovat"],
			
			// This is the personal message
			451: ["Personal Message",
					"Osobní zpráva"],
			// It feels weird to use "we", but using "I" would mean changing it the second anyone else does anything, so...
			452: ["Hey, this is the least intrusive way we could think of contacting you.<br/><br/>" +
					"We want you to know that we deeply care about your experience with this little extension. If there is any way we could improve it to make your life easier, let us know, either in a review or by creating an issue on <a href=\"https://github.com/sdasda7777/ScheduleBlock\">project's GitHub page</a>. Same goes for any bugs you might find.<br/><br/>" + 
					"Last but not least, we believe in you, and you've got this.",
					
					"Dobrý den, toto je nejméně rušivý způsob, jakým nás napadlo Vás kontaktovat.<br/><br/>" +
					"Chceme, abyste věděli, že nám záleží na zážitku z používání tohoto malého rozšíření. Pokud by Vás napadl jakýkoli způsob, kterým bychom ho mohli vylepšit, abychom Vám usnadnili život, neváhejte nás kontaktovat, ať už v recenzi, nebo vytvořením Issue na <a href=\"https://github.com/sdasda7777/ScheduleBlock\">stránce projektu na GitHubu</a>. To samé platí o jakýchkoli chybách, které můžete najít.<br/><br/>" + 
					"V poslední řadě chceme, abyste věděli, že ve Vás věříme."]
		};
		
		return INTERFACE_STRINGS[messageCode];
	}

	setLanguageIndex(newLangIndex){
		this.languageIndex = newLangIndex;
	}

	getTranslatedString(messageCode){
		let versions = this.getStringVersions(messageCode)
		
		if(versions == undefined)
			return false;
		if(this.languageIndex < versions.length && versions[this.languageIndex] != "")
			return versions[this.languageIndex];
		return versions[0];
	}
}