// Curated academic & literary vocabulary database for the Vocab Learning Hub
// Loaded globally to ensure offline-friendly execution and zero CORS issues on file:// protocol.

const VOCAB_DATABASE = [
  {
    word: "ephemeral",
    type: "adjective",
    definition: "Lasting for a very short time; transient or fleeting.",
    example: "The beauty of cherry blossoms is ephemeral, lasting only a few days before they fall.",
    synonyms: ["fleeting", "transient", "brief", "evanescent", "temporary"],
    antonyms: ["eternal", "permanent", "perpetual", "enduring", "lasting"]
  },
  {
    word: "ubiquitous",
    type: "adjective",
    definition: "Present, appearing, or found everywhere.",
    example: "In today's digital age, smartphones have become completely ubiquitous.",
    synonyms: ["omnipresent", "pervasive", "everywhere", "prevalent", "universal"],
    antonyms: ["rare", "scarce", "infrequent", "uncommon", "localized"]
  },
  {
    word: "serendipity",
    type: "noun",
    definition: "The occurrence of valuable or agreeable events by chance in a happy or beneficial way.",
    example: "It was pure serendipity that we ran into each other in a city of millions.",
    synonyms: ["fluke", "coincidence", "happy accident", "good fortune", "chance"],
    antonyms: ["misfortune", "adversity", "bad luck", "inevitability", "design"]
  },
  {
    word: "loquacious",
    type: "adjective",
    definition: "Tending to talk a great deal; extremely talkative.",
    example: "The loquacious host kept the party entertained with endless stories and anecdotes.",
    synonyms: ["garrulous", "talkative", "verbose", "chatty", "wordy"],
    antonyms: ["taciturn", "reticent", "silent", "quiet", "reserved"]
  },
  {
    word: "pragmatic",
    type: "adjective",
    definition: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
    example: "She made a pragmatic decision to compromise rather than fight an unwinnable battle.",
    synonyms: ["practical", "realistic", "down-to-earth", "sensible", "hardheaded"],
    antonyms: ["idealistic", "unrealistic", "impractical", "visionary", "romantic"]
  },
  {
    word: "capricious",
    type: "adjective",
    definition: "Given to sudden and unaccountable changes of mood or behavior.",
    example: "The administration of the dictator was capricious, passing laws on a whim and repealing them the next day.",
    synonyms: ["fickle", "volatile", "unpredictable", "mercurial", "erratic"],
    antonyms: ["stable", "consistent", "predictable", "steady", "reliable"]
  },
  {
    word: "cacophony",
    type: "noun",
    definition: "A harsh, discordant mixture of sounds.",
    example: "A terrible cacophony of car horns and construction sirens rose from the busy intersection.",
    synonyms: ["din", "racket", "discord", "clamor", "noise"],
    antonyms: ["harmony", "euphony", "silence", "melody", "quiet"]
  },
  {
    word: "zenith",
    type: "noun",
    definition: "The time at which something is most powerful, successful, or at its peak.",
    example: "With the release of her blockbuster movie, the actress reached the zenith of her career.",
    synonyms: ["peak", "pinnacle", "apex", "summit", "climax"],
    antonyms: ["nadir", "bottom", "trough", "lowest point"]
  },
  {
    word: "nadir",
    type: "noun",
    definition: "The lowest point in the fortunes of a person or organization.",
    example: "Failing his final exam represented the nadir of his academic journey, but it motivated him to work harder.",
    synonyms: ["rock bottom", "lowest point", "depths", "zero"],
    antonyms: ["zenith", "peak", "pinnacle", "apex", "summit"]
  },
  {
    word: "fastidious",
    type: "adjective",
    definition: "Very attentive to and concerned about accuracy and detail; very concerned about cleanliness.",
    example: "The restorer's fastidious attention to detail saved the centuries-old painting from ruin.",
    synonyms: ["meticulous", "scrupulous", "painstaking", "fussy", "demanding"],
    antonyms: ["careless", "sloppy", "easygoing", "indifferent", "lax"]
  },
  {
    word: "alacrity",
    type: "noun",
    definition: "Brisk and cheerful readiness.",
    example: "She accepted the promotion with alacrity, eager to take on the new responsibilities.",
    synonyms: ["eagerness", "enthusiasm", "willingness", "promptness", "zeal"],
    antonyms: ["apathy", "reluctance", "sluggishness", "indifference", "hesitation"]
  },
  {
    word: "magnanimous",
    type: "adjective",
    definition: "Generous or forgiving, especially toward a rival or less powerful person.",
    example: "In his victory speech, the candidate was magnanimous, praising his opponent's tough campaign.",
    synonyms: ["generous", "charitable", "noble", "forgiving", "benevolent"],
    antonyms: ["petty", "mean-spirited", "vindictive", "selfish", "unforgiving"]
  },
  {
    word: "vociferous",
    type: "adjective",
    definition: "Expressing feelings or opinions in a very loud, noisy, or forceful way.",
    example: "The proposal met with vociferous opposition from residents who feared increased traffic.",
    synonyms: ["vehement", "clamorous", "vocal", "outspoken", "blatant"],
    antonyms: ["quiet", "silent", "subdued", "soft-spoken", "reticent"]
  },
  {
    word: "aesthetic",
    type: "adjective",
    definition: "Concerned with beauty or the appreciation of beauty.",
    example: "The minimalist design of the museum was selected for its high aesthetic appeal.",
    synonyms: ["artistic", "beautiful", "elegant", "exquisite", "tasteful"],
    antonyms: ["unattractive", "plain", "ugly", "unaesthetic"]
  },
  {
    word: "benevolent",
    type: "adjective",
    definition: "Well-meaning and kindly; serving a charitable rather than a profit-making purpose.",
    example: "The museum was founded by a benevolent local business leader who donated her entire art collection.",
    synonyms: ["kindly", "charitable", "philanthropic", "altruistic", "humanitarian"],
    antonyms: ["malevolent", "spiteful", "cruel", "malicious", "selfish"]
  },
  {
    word: "mitigate",
    type: "verb",
    definition: "Make less severe, serious, or painful; lessen the gravity of.",
    example: "Planting more trees can help mitigate the effects of urban heat islands.",
    synonyms: ["alleviate", "reduce", "diminish", "assuage", "mollify"],
    antonyms: ["aggravate", "exacerbate", "intensify", "worsen", "provoke"]
  },
  {
    word: "bolster",
    type: "verb",
    definition: "Support or strengthen; prop up.",
    example: "The team did additional research to bolster their argument before presenting it to the board.",
    synonyms: ["strengthen", "support", "reinforce", "boost", "fortify"],
    antonyms: ["undermine", "weaken", "hinder", "obstruct", "damage"]
  },
  {
    word: "candid",
    type: "adjective",
    definition: "Truthful and straightforward; frank; informal or natural.",
    example: "During the interview, the retired politician gave a candid account of the negotiations.",
    synonyms: ["frank", "honest", "forthright", "sincere", "direct"],
    antonyms: ["guarded", "evasive", "insincere", "deceitful", "dishonest"]
  },
  {
    word: "austere",
    type: "adjective",
    definition: "Severe or strict in manner, attitude, or appearance; extremely simple or unadorned.",
    example: "The monk lived a very austere life in a small, unheated cell with only a bed and desk.",
    synonyms: ["stark", "spartan", "frugal", "severe", "ascetic"],
    antonyms: ["luxurious", "ornate", "indulgent", "elaborate", "comfortable"]
  },
  {
    word: "anomaly",
    type: "noun",
    definition: "Something that deviates from what is standard, normal, or expected.",
    example: "An annual temperature of eighty degrees is a complete anomaly in this subzero region.",
    synonyms: ["aberration", "peculiarity", "exception", "oddity", "irregularity"],
    antonyms: ["norm", "standard", "regularity", "conformity", "habit"]
  },
  {
    word: "apathy",
    type: "noun",
    definition: "Lack of interest, enthusiasm, or concern.",
    example: "Voter apathy is a significant challenge in local elections, with turnout often below fifteen percent.",
    synonyms: ["indifference", "lethargy", "detachment", "unresponsiveness", "passivity"],
    antonyms: ["enthusiasm", "passion", "concern", "eagerness", "interest"]
  },
  {
    word: "dogmatic",
    type: "adjective",
    definition: "Inclined to lay down principles as incontrovertibly true, without consideration of evidence or other opinions.",
    example: "She is so dogmatic in her beliefs that she refuses to listen to any scientific counterarguments.",
    synonyms: ["opinionated", "doctrinaire", "assertive", "inflexible", "intolerant"],
    antonyms: ["open-minded", "flexible", "tolerant", "skeptical", "pragmatic"]
  },
  {
    word: "enigma",
    type: "noun",
    definition: "A person or thing that is mysterious, puzzling, or difficult to understand.",
    example: "The origin of the ancient stone circles remains an unsolved historical enigma.",
    synonyms: ["mystery", "puzzle", "riddle", "conundrum", "paradox"],
    antonyms: ["clarity", "explanation", "solution", "obviousness"]
  },
  {
    word: "prevaricate",
    type: "verb",
    definition: "Speak or act in an evasive way; avoid giving a direct answer.",
    example: "When questioned about his whereabouts, the suspect began to prevaricate and change his story.",
    synonyms: ["equivocate", "quibble", "sidestep", "dodge", "lie"],
    antonyms: ["confront", "face", "be honest", "speak truth", "simplify"]
  },
  {
    word: "erudite",
    type: "adjective",
    definition: "Having or showing great knowledge or learning.",
    example: "The erudite professor wrote a detailed commentary on classical Greek philosophy.",
    synonyms: ["scholarly", "knowledgeable", "learned", "intellectual", "well-read"],
    antonyms: ["ignorant", "uneducated", "illiterate", "uninformed"]
  },
  {
    word: "assuage",
    type: "verb",
    definition: "Make an unpleasant feeling less intense; satisfy an appetite or desire.",
    example: "The government tried to assuage public fears by releasing a detailed safety report.",
    synonyms: ["soothe", "alleviate", "ease", "mitigate", "appease"],
    antonyms: ["aggravate", "intensify", "provoke", "exacerbate", "worsen"]
  },
  {
    word: "audacious",
    type: "adjective",
    definition: "Showing a willingness to take surprisingly bold risks; showing an impudent lack of respect.",
    example: "The mountain climber made an audacious attempt to scale the vertical cliff during a snowstorm.",
    synonyms: ["bold", "daring", "fearless", "intrepid", "venturesome"],
    antonyms: ["timid", "cowardly", "cautious", "fearful", "meek"]
  },
  {
    word: "laconic",
    type: "adjective",
    definition: "Using very few words in speech or writing.",
    example: "The cowboy was famous for his laconic style, often responding with a single nod or 'yep'.",
    synonyms: ["terse", "succinct", "concise", "pithy", "taciturn"],
    antonyms: ["verbose", "wordy", "loquacious", "garrulous", "talkative"]
  },
  {
    word: "obsequious",
    type: "adjective",
    definition: "Obedient or attentive to an excessive or servile degree.",
    example: "The manager was surrounded by obsequious assistants who agreed with every word he said.",
    synonyms: ["servile", "fawning", "sycophantic", "submissive", "groveling"],
    antonyms: ["domineering", "independent", "assertive", "rebellious", "defiant"]
  },
  {
    word: "pedantic",
    type: "adjective",
    definition: "Excessively concerned with minor details or rules, especially in academic learning.",
    example: "The editor's pedantic insistence on obscure grammatical rules annoyed the writers.",
    synonyms: ["fussy", "nitpicking", "scrupulous", "academic", "bookish"],
    antonyms: ["imprecise", "careless", "broad", "casual", "informal"]
  },
  {
    word: "ostentatious",
    type: "adjective",
    definition: "Designed to impress or attract notice; characterized by vulgar or pretentious display.",
    example: "He wore an ostentatious diamond-encrusted watch that immediately drew everyone's attention.",
    synonyms: ["showy", "pretentious", "gaudy", "flashy", "flamboyant"],
    antonyms: ["modest", "unpretentious", "simple", "restrained", "understated"]
  },
  {
    word: "lethargic",
    type: "adjective",
    definition: "Apathetic, sluggish, and lacking in energy or enthusiasm.",
    example: "After eating a heavy lunch on a hot afternoon, she felt incredibly lethargic.",
    synonyms: ["sluggish", "listless", "lazy", "torpid", "apathetic"],
    antonyms: ["energetic", "vigorous", "active", "lively", "alert"]
  },
  {
    word: "venerate",
    type: "verb",
    definition: "Regard with great respect; revere.",
    example: "Many cultures venerate their ancestors through annual festivals and ceremonies.",
    synonyms: ["revere", "worship", "respect", "honor", "hallow"],
    antonyms: ["despise", "scorn", "disdain", "condemn", "vilify"]
  },
  {
    word: "vacillate",
    type: "verb",
    definition: "Alternate or waver between different opinions or actions; be indecisive.",
    example: "The president seemed to vacillate between taking strict military action or continuing talks.",
    synonyms: ["waver", "hesitate", "dither", "oscillate", "fluctuate"],
    antonyms: ["decide", "resolve", "stand firm", "choose", "commit"]
  },
  {
    word: "precocious",
    type: "adjective",
    definition: "Having developed certain abilities or proclivities at an earlier age than usual.",
    example: "The precocious child was solving complex algebraic equations by the age of six.",
    synonyms: ["advanced", "gifted", "talented", "mature", "quick-witted"],
    antonyms: ["backward", "slow", "delayed", "average"]
  },
  {
    word: "exacerbate",
    type: "verb",
    definition: "Make a problem, bad situation, or negative feeling worse.",
    example: "Scratching an insect bite will only exacerbate the itch and potentially lead to an infection.",
    synonyms: ["worsen", "aggravate", "intensify", "inflame", "provoke"],
    antonyms: ["alleviate", "mitigate", "assuage", "soothe", "ease"]
  },
  {
    word: "verbose",
    type: "adjective",
    definition: "Using or expressed in more words than are needed.",
    example: "The essay was so verbose that the core message was lost in a sea of unnecessary descriptions.",
    synonyms: ["wordy", "loquacious", "prolix", "windy", "redundant"],
    antonyms: ["concise", "succinct", "laconic", "terse", "brief"]
  },
  {
    word: "diligent",
    type: "adjective",
    definition: "Having or showing care and conscientiousness in one's work or duties.",
    example: "Through diligent practice and study, she mastered the violin in record time.",
    synonyms: ["industrious", "hardworking", "assiduous", "conscientious", "painstaking"],
    antonyms: ["lazy", "negligent", "careless", "slothful", "indifferent"]
  },
  {
    word: "reticent",
    type: "adjective",
    definition: "Not revealing one's thoughts or feelings readily; reserved.",
    example: "She was reticent about her personal life, preferring to keep her family out of the public eye.",
    synonyms: ["reserved", "uncommunicative", "taciturn", "quiet", "introverted"],
    antonyms: ["talkative", "open", "loquacious", "candid", "expressive"]
  },
  {
    word: "esoteric",
    type: "adjective",
    definition: "Intended for or likely to be understood by only a small number of people with a specialized knowledge.",
    example: "The physics seminar discussed esoteric theories that left most undergraduate students confused.",
    synonyms: ["obscure", "abstruse", "arcane", "mysterious", "cryptic"],
    antonyms: ["accessible", "commonplace", "popular", "familiar", "public"]
  },
  {
    word: "mollify",
    type: "verb",
    definition: "Appease the anger or anxiety of someone; reduce the severity of.",
    example: "The customer service representative tried to mollify the angry customer by offering a full refund.",
    synonyms: ["placate", "pacify", "appease", "soothe", "calm"],
    antonyms: ["enrage", "anger", "provoke", "incense", "infuriate"]
  },
  {
    word: "advocate",
    type: "verb",
    definition: "Publicly recommend or support a particular cause or policy.",
    example: "He decided to advocate for local environmental protections before the city council.",
    synonyms: ["support", "champion", "promote", "defend", "recommend"],
    antonyms: ["oppose", "condemn", "resist", "discourage", "attack"]
  },
  {
    word: "deference",
    type: "noun",
    definition: "Humble submission and respect.",
    example: "He bowed his head in deference to the spiritual leader as she entered the temple.",
    synonyms: ["respect", "reverence", "submission", "obedience", "esteem"],
    antonyms: ["disrespect", "defiance", "contempt", "insolence", "scorn"]
  },
  {
    word: "meticulous",
    type: "adjective",
    definition: "Showing great attention to detail; very careful and precise.",
    example: "The researcher kept meticulous records of every variable during the three-year experiment.",
    synonyms: ["painstaking", "scrupulous", "fastidious", "detailed", "careful"],
    antonyms: ["careless", "sloppy", "hasty", "imprecise", "casual"]
  },
  {
    word: "placate",
    type: "verb",
    definition: "Make someone less angry or hostile, usually by making concessions.",
    example: "They offered a compromise in an attempt to placate the protesting workers.",
    synonyms: ["mollify", "appease", "pacify", "conciliate", "soothe"],
    antonyms: ["provoke", "anger", "infuriate", "irritate", "agitate"]
  },
  {
    word: "belligerent",
    type: "adjective",
    definition: "Hostile and aggressive; engaged in war or conflict.",
    example: "The customer became belligerent when the store refused to accept the expired coupon.",
    synonyms: ["hostile", "aggressive", "pugnacious", "combative", "antagonistic"],
    antonyms: ["peaceful", "amicable", "friendly", "cooperative", "conciliatory"]
  },
  {
    word: "equivocate",
    type: "verb",
    definition: "Use ambiguous language so as to conceal the truth or avoid committing oneself.",
    example: "The governor chose to equivocate during the press conference rather than give a clear yes or no.",
    synonyms: ["prevaricate", "quibble", "sidestep", "hedge", "evade"],
    antonyms: ["be direct", "confront", "state clearly", "simplify", "admit"]
  },
  {
    word: "impervious",
    type: "adjective",
    definition: "Not allowing fluid to pass through; unable to be affected by.",
    example: "She seemed impervious to the harsh criticism, continuing her work with complete focus.",
    synonyms: ["impenetrable", "impermeable", "unaffected", "immune", "resistant"],
    antonyms: ["susceptible", "vulnerable", "permeable", "sensitive", "open"]
  },
  {
    word: "gregarious",
    type: "adjective",
    definition: "Fond of company; sociable.",
    example: "Parrots are highly gregarious birds, living and traveling in large, noisy flocks.",
    synonyms: ["sociable", "outgoing", "friendly", "extroverted", "companionable"],
    antonyms: ["unsociable", "reclusive", "introverted", "shy", "reserved"]
  },
  {
    word: "indolent",
    type: "adjective",
    definition: "Wanting to avoid exertion; lazy.",
    example: "The hot, humid afternoon made everyone feel indolent, dreaming of cool air and soft beds.",
    synonyms: ["lazy", "slothful", "idle", "lethargic", "sluggish"],
    antonyms: ["industrious", "diligent", "active", "energetic", "busy"]
  },
  {
    word: "recondite",
    type: "adjective",
    definition: "Little known; abstruse; obscure.",
    example: "He spent years researching recondite facts about medieval taxation systems.",
    synonyms: ["obscure", "abstruse", "esoteric", "arcane", "deep"],
    antonyms: ["simple", "straightforward", "obvious", "well-known", "familiar"]
  },
  {
    word: "sycophant",
    type: "noun",
    definition: "A person who acts obsequiously toward someone important in order to gain advantage.",
    example: "The king was surrounded by sycophants who praised his terrible poetry just to win his favor.",
    synonyms: ["flatterer", "yes-man", "toady", "bootlicker", "lickspittle"],
    antonyms: ["rebel", "freethinker", "critic", "adversary", "detractor"]
  },
  {
    word: "perfidy",
    type: "noun",
    definition: "Deceitfulness; untrustworthiness; betrayal of trust.",
    example: "The spy was imprisoned for his perfidy after selling confidential battle plans to the rival country.",
    synonyms: ["treachery", "betrayal", "treason", "duplicity", "infidelity"],
    antonyms: ["loyalty", "faithfulness", "fidelity", "trustworthiness", "honesty"]
  },
  {
    word: "insipid",
    type: "adjective",
    definition: "Lacking flavor; lacking vigor or interest.",
    example: "The lecture was insipid, consisting mostly of the speaker reading slides in a monotone.",
    synonyms: ["bland", "dull", "uninteresting", "boring", "tasteless"],
    antonyms: ["tasty", "exciting", "vibrant", "interesting", "savory"]
  },
  {
    word: "querulous",
    type: "adjective",
    definition: "Complaining in a petulant or whining manner.",
    example: "The long delay at the airport made the tired passengers irritable and querulous.",
    synonyms: ["peevish", "whiny", "fretful", "complaining", "petulant"],
    antonyms: ["cheerful", "content", "easygoing", "patient", "satisfied"]
  },
  {
    word: "spurious",
    type: "adjective",
    definition: "Not being what it purports to be; false or fake.",
    example: "The internet is flooded with spurious health advice from unqualified influencers.",
    synonyms: ["bogus", "fake", "false", "counterfeit", "specious"],
    antonyms: ["genuine", "authentic", "real", "valid", "legitimate"]
  },
  {
    word: "alleviate",
    type: "verb",
    definition: "Make suffering, deficiency, or a problem less severe.",
    example: "Taking an aspirin can help alleviate the throbbing pain of a headache.",
    synonyms: ["mitigate", "ease", "relieve", "assuage", "reduce"],
    antonyms: ["aggravate", "worsen", "intensify", "exacerbate", "heighten"]
  },
  {
    word: "capitulate",
    type: "verb",
    definition: "Surrender; cease to resist an opponent or an unwelcome demand.",
    example: "After weeks of pressure from shareholders, the board of directors finally decided to capitulate.",
    synonyms: ["surrender", "yield", "succumb", "give in", "concede"],
    antonyms: ["resist", "fight", "withstand", "defy", "hold out"]
  },
  {
    word: "dogma",
    type: "noun",
    definition: "A principle or set of principles laid down by an authority as incontrovertibly true.",
    example: "He was careful not to let ideological dogma blind him to the complex scientific facts.",
    synonyms: ["creed", "doctrine", "belief", "canon", "tenet"],
    antonyms: ["skepticism", "doubt", "heresy", "unbelief", "inquiry"]
  },
  {
    word: "frugal",
    type: "adjective",
    definition: "Sparing or economical with regard to money or food; simple and plain.",
    example: "She leads a very frugal life, clipping coupons and growing her own vegetables to save money.",
    synonyms: ["economical", "thrifty", "spartan", "prudent", "abstemious"],
    antonyms: ["extravagant", "spendthrift", "wasteful", "luxurious", "prodigal"]
  },
  {
    word: "pithy",
    type: "adjective",
    definition: "Concise and forcefully expressive.",
    example: "He is famous for his pithy catchphrases that perfectly capture complex political concepts.",
    synonyms: ["succinct", "terse", "brief", "concise", "pointed"],
    antonyms: ["verbose", "wordy", "prolix", "loquacious", "diffuse"]
  },
  {
    word: "superfluous",
    type: "adjective",
    definition: "Unnecessary, especially through being more than enough.",
    example: "The instructor edited out the superfluous adjectives to make the student's writing sharper.",
    synonyms: ["redundant", "excessive", "surplus", "extra", "unneeded"],
    antonyms: ["essential", "necessary", "required", "vital", "indispensable"]
  },
  {
    word: "truculent",
    type: "adjective",
    definition: "Eager or quick to argue or fight; aggressively defiant.",
    example: "His truculent attitude made it very difficult to resolve disputes peacefully.",
    synonyms: ["hostile", "belligerent", "combative", "aggressive", "defiant"],
    antonyms: ["cooperative", "gentle", "peaceable", "friendly", "meek"]
  },
  {
    word: "zealous",
    type: "adjective",
    definition: "Having or showing great energy or enthusiasm in pursuit of a cause or an objective.",
    example: "The zealous volunteers spent every weekend canvassing neighborhoods and registering voters.",
    synonyms: ["enthusiastic", "passionate", "ardent", "fervent", "dedicated"],
    antonyms: ["apathetic", "indifferent", "uninterested", "languid", "cool"]
  }
];
