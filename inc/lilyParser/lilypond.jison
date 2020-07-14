
%{
	const preferNumber = x => Number.isFinite(Number(x)) ? Number(x) : x;

	const location = (begin, end) => ({proto: "_PLAIN", lines: [begin.first_line, end.last_line], columns: [begin.first_column, end.last_column]});


	const root = (sections = []) => ({proto: "Root", sections});

	const appendSection = (list, item) => {
		list.sections.push(item);

		return list;
	};

	const string = exp => ({proto: "LiteralString", exp});

	const command = (cmd, ...args) => ({proto: "Command", cmd: cmd.substr(1), args});

	const variable = name => ({proto: "Variable", name: name.substr(1)});

	const markupCommand = (cmd, ...args) => ({proto: "MarkupCommand", cmd: cmd.substr(1), args});

	const chord = (pitches, duration, {locations, ...options} = {}) => ({proto: "Chord", pitches, duration, _location: location(...locations), options: {...options, proto: "_PLAIN"}});

	const chordElem = (pitch, {locations, ...options}) => ({proto: "ChordElement", pitch, _location: location(...locations), options: {...options, proto: "_PLAIN"}});

	const briefChord = (body, {locations, post_events = null} = {}) => ({proto: "BriefChord", body: {...body, proto: "_PLAIN"}, post_events, _location: location(...locations)});

	const block = (block, head, body = []) => ({proto: "Block", block, head, body});

	const inlineBlock = body => ({proto: "InlineBlock", body});

	const scheme = exp => ({proto: "Scheme", exp});

	const schemeFunction = (func, args) => ({proto: "SchemeFunction", func, args});

	const schemePair = (left, right) => ({proto: "SchemePair", left, right});

	const schemePointer = value => ({proto: "SchemePointer", value});

	const schemeEmbed = value => ({proto: "SchemeEmbed", value});

	const assignment = (key, value) => ({proto: "Assignment", key, value});

	const numberUnit = (number, unit) => ({proto: "NumberUnit", number: preferNumber(number), unit});

	const musicBlock = body => ({proto: "MusicBlock", body});

	const simultaneousList = list => ({proto: "SimultaneousList", list});

	const contextedMusic = (head, body, lyrics) => ({proto: "ContextedMusic", head, body, lyrics});

	const tempo = (beatsPerMinute, unit, text) => ({proto: "Tempo", beatsPerMinute: preferNumber(beatsPerMinute), unit: preferNumber(unit), text});

	const postEvent = (direction, arg) => ({proto: "PostEvent", direction, arg});

	const fingering = value => ({proto: "Fingering", value: preferNumber(value)});

	const markup = (head, body) => ({proto: "Markup", head, body});

	const lyric = (content, {locations, ...options}) => ({proto: "Lyric", content, _location: location(...locations), ...options});

	const duration = ({number, dots, multipliers}) => ({proto: "Duration", number, dots, multipliers});
%}


%lex

%option flex unicode

A					[a-zA-Z\200-\377]
AA					{A}|_
N					[0-9]
ANY_CHAR			(.|\n)
SYMBOL				{A}([-_]{A}|{A})*
COMMAND				\\{SYMBOL}
/* SPECIAL category is for every letter that needs to get passed to
 * the parser rather than being redefinable by the user */
SPECIAL				[-+*/=<>{}!?_^'',.:]
SHORTHAND			(.|\\.)
UNSIGNED			{N}+
E_UNSIGNED			\\{N}+
FRACTION			{N}+\/{N}+
//INT					[-]?{UNSIGNED}
//REAL				({INT}\.{N}*)|([-]?\.{N}+)
STRICTREAL			{UNSIGNED}\.{UNSIGNED}
WHITE				[ \n\t\f\r]
HORIZONTALWHITE		[ \t]
BLACK				[^ \n\t\f\r]
RESTNAME			[rs]
ESCAPED				[nt\\''""]
EXTENDER			\_\_
HYPHEN				\-\-
BOM_UTF8			\357\273\277

PHONET				[abcdefgrRqh]
PITCH				{PHONET}(([i][s])*|([e][s])*|[s][e][s]|[s]*|[f]*)(?=[\W\d_])
PLACEHOLDER_PITCH	[s](?=[\W\d])
//DURATION			"1"|"2"|"4"|"8"|"16"|"32"|"64"|"128"|"256"

//UNICODE_HAN			[\p{Script=Han}]

%%

// workaround non-word-boundary parsing for POST_UNSIGNED
//\s{FRACTION}				yytext = yytext.replace(/^\s+/, ""); return 'FRACTION';
//\s{REAL}					yytext = yytext.replace(/^\s+/, ""); return 'REAL';
//(?:#){REAL}					return 'REAL';
//\s{UNSIGNED}				yytext = yytext.replace(/^\s+/, ""); return 'UNSIGNED';

// extra lex
// TODO: parse the dollar expression details
[$][(][^()]*[)]				return 'DOLLAR_SCHEME_EXPRESSION'

\s+							{}	// spaces
\%\{(.|\n)*?\%\}			{}	// scoped comments
\%[^\n]*\n					{}	// single comments
\"(\\\"|[^"])*\"			return 'STRING';

{EXTENDER}					return 'EXTENDER';
{HYPHEN}					return 'HYPHEN';

//"/+"						return CHORD_BASS;
//"^"							return CHORD_CARET;
//":"							return CHORD_COLON;
//"-"							return CHORD_MINUS;
//"/"							return CHORD_SLASH;

//"<"							return 'ANGLE_OPEN';
//">"							return 'ANGLE_CLOSE';
"<<"						return 'DOUBLE_ANGLE_OPEN';
">>"						return 'DOUBLE_ANGLE_CLOSE';

"\\\\"						return 'E_BACKSLASH';

{E_UNSIGNED}				return 'E_UNSIGNED';

"\\new"						return 'NEWCONTEXT';

"\\cm"						return 'CENTIMETER';
"\\mm"						return 'MILLIMETER';

"\\overrideProperty"		return 'OVERRIDEPROPERTY';

// binary commands
"\\relative"				return 'CMD_RELATIVE';
"\\absolute"				return 'CMD_ABSOLUTE';
"\\tweak"					return 'CMD_TWEAK';
"\\key"						return 'CMD_KEY';
//"\\times"					return 'CMD_TIMES';
[\\][t][i][m][e][s]			return 'CMD_TIMES';
"\\afterGrace"				return 'CMD_AFTERGRACE';
"\\parallelMusic"			return 'CMD_PARALLELMUSIC';
"\\shape"					return 'CMD_SHAPE';

// unitary commands
"\\clef"					return 'CMD_CLEF';
"\\time"					return 'CMD_TIME';
"\\stemUp"					return 'CMD_STEMUP';
"\\stemDown"				return 'CMD_STEMDOWN';
"\\stemNeutral"				return 'CMD_STEMNEUTRAL';
"\\bar"						return 'CMD_BAR';
"\\omit"					return 'CMD_OMIT';
"\\ottava"					return 'CMD_OTTAVA';
"\\barNumberCheck"			return 'CMD_BARNUMBERCHECK';
"\\partial"					return 'CMD_PARTIAL';
"\\mark"					return 'CMD_MARK';
"\\include"					return 'CMD_INCLUDE';
"\\tupletSpan"				return 'CMD_TUPLETSPAN';
"\\tuplet"					return 'CMD_TUPLET';
"\\skip"					return 'CMD_SKIP';
"\\skip"(?=\d)				return 'CMD_SKIP';
"\\parenthesize"			return 'CMD_PARENTHESIZE';
"\\unfoldRepeats"			return 'CMD_UNFOLDREPEATS';
"\\grace"					return 'CMD_GRACE';
"\\acciaccatura"			return 'CMD_ACCIACCATURA';
"\\appoggiatura"			return 'CMD_APPOGGIATURA';
"\\slashedGrace"			return 'CMD_SLASHEDGRACE';
"\\language"				return 'CMD_LANGUAGE';
"\\once"					return 'CMD_ONCE';
"\\accidentalStyle"			return 'CMD_ACCIDENTALSTYLE';
"\\numericTimeSignature"	return 'CMD_NUMERICTIMESIGNATURE';

"\\tempoLegend"				return 'CMD_TEMPOLEGEND';
"\\fermata"					return 'CMD_FERMATA';
"\\mergeDifferentlyDottedOn"	return 'CMD_MERGEDIFFERENTLYDOTTEDON';
"\\mergeDifferentlyHeadedOn"	return 'CMD_MERGEDIFFERENTLYHEADEDON';
"\\voiceOne"				return 'CMD_VOICE_NUMBER';
"\\voiceTwo"				return 'CMD_VOICE_NUMBER';
"\\voiceThree"				return 'CMD_VOICE_NUMBER';
"\\voiceFour"				return 'CMD_VOICE_NUMBER';
"\\voiceFive"				return 'CMD_VOICE_NUMBER';
"\\Score"					return 'CMD_SCORE';
"\\arpeggio"				return 'CMD_ARPEGGIO';
"\\arpeggioArrowDown"		return 'CMD_ARPEGGIOARROWDOWN';
"\\arpeggioArrowUp"			return 'CMD_ARPEGGIOARROWUP';
"\\arpeggioNormal"			return 'CMD_ARPEGGIONORMAL';
"\\glissando"				return 'CMD_GLISSANDO';
"\\mordent"					return 'CMD_MORDENT';
"\\musicglyph"				return 'CMD_MUSICGLYPH';
"\\powerChords"				return 'CMD_POWERCHORDS';
"\\prall"					return 'CMD_PRALL';
"\\sustainOff"				return 'CMD_SUSTAINOFF';
"\\sustainOn"				return 'CMD_SUSTAINON';
"\\trill"					return 'CMD_TRILL';
"\\turn"					return 'CMD_TURN';

"\\mp"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';
"\\mf"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';
"\\"[p]+(?=[\W])			return 'CMD_DYNAMIC_MARKINGS';
"\\"[f]+(?=[\W])			return 'CMD_DYNAMIC_MARKINGS';
"\\sf"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';
"\\sff"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';
"\\sfp"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';
"\\sfpp"(?=[\W])			return 'CMD_DYNAMIC_MARKINGS';
"\\fp"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';
"\\rf"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';
"\\rfz"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';
"\\sfz"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';
"\\sffz"(?=[\W])			return 'CMD_DYNAMIC_MARKINGS';
"\\fz"(?=[\W])				return 'CMD_DYNAMIC_MARKINGS';

"\\breve"					return 'CMD_BREVE';
"\\longa"					return 'CMD_LONGA';

// markup commands
"\\version"					return 'CMD_VERSION';
"\\column"					return 'CMD_COLUMN';
"\\line"					return 'CMD_LINE';
"\\bold"					return 'CMD_BOLD';
"\\italic"					return 'CMD_ITALIC';
"\\box"						return 'CMD_BOX';
"\\whiteout"				return 'CMD_WHITEOUT';
"\\dynamic"					return 'CMD_DYNAMIC';
"\\abs-fontsize"			return 'CMD_ABS_FONTSIZE';
"\\with-color"				return 'CMD_WITH_COLOR';
"\\char"					return 'CMD_CHAR';
"\\center-column"			return 'CMD_CENTER_COLUMN';
"\\right-column"			return 'CMD_RIGHT_COLUMN';
"\\with-url"				return 'CMD_WITH_URL';
"\\sans"					return 'CMD_SANS';
"\\concat"					return 'CMD_CONCAT';
"\\maintainer"				return 'CMD_MAINTAINER';
"\\footnote"				return 'CMD_FOOTNOTE';
"\\natural"					return 'CMD_NATURAL';

"\\huge"					return 'CMD_HUGE';
"\\large"					return 'CMD_LARGE';
"\\normalsize"				return 'CMD_NORMALSIZE';
"\\small"					return 'CMD_SMALL';
"\\tiny"					return 'CMD_TINY';
"\\teeny"					return 'CMD_TEENY';

// syntax commands
"\\header"					return 'HEADER';
"\\markup"					return 'MARKUP';
"\\markuplist"				return 'MARKUPLIST';
"\\repeat"					return 'REPEAT';
"\\context"					return 'CONTEXT';
"\\accepts"					return 'ACCEPTS';
"\\addlyrics"				return 'ADDLYRICS';
"\\alias"					return 'ALIAS';
"\\alternative"				return 'ALTERNATIVE';
"\\book"					return 'BOOK';
"\\bookpart"				return 'BOOKPART';
"\\change"					return 'CHANGE';
"\\chordmode"				return 'CHORDMODE';
"\\chords"					return 'CHORDS';
"\\consists"				return 'CONSISTS';
"\\default"					return 'DEFAULT';
"\\defaultchild"			return 'DEFAULTCHILD';
"\\denies"					return 'DENIES';
"\\description"				return 'DESCRIPTION';
"\\drummode"				return 'DRUMMODE';
"\\drums"					return 'DRUMS';
"\\etc"						return 'ETC';
"\\figuremode"				return 'FIGUREMODE';
"\\figures"					return 'FIGURES';
"\\version-error"			return 'INVALID';
"\\layout"					return 'LAYOUT';
"\\lyricmode"				return 'LYRICMODE';
"\\lyrics"					return 'LYRICS';
"\\lyricsto"				return 'LYRICSTO';
"\\midi"					return 'MIDI';
"\\name"					return 'NAME';
"\\notemode"				return 'NOTEMODE';
"\\override"				return 'OVERRIDE';
"\\paper"					return 'PAPER';
"\\remove"					return 'REMOVE';
"\\rest"					return 'REST';
"\\revert"					return 'REVERT';
"\\score"					return 'SCORE';
"\\score-lines"				return 'SCORELINES';
"\\sequential"				return 'SEQUENTIAL';
"\\set"						return 'SET';
"\\simultaneous"			return 'SIMULTANEOUS';
"\\tempo"					return 'TEMPO';
"\\type"					return 'TYPE';
"\\unset"					return 'UNSET';
"\\with"					return 'WITH';

// simple commands
"\\<"						return 'CMD_CRESCENDO_BEGIN';
"\\>"						return 'CMD_DECRESCENDO_BEGIN';
"\\!"						return 'CMD_DYNAMICS_END';

{COMMAND}					return 'COMMAND';

{PITCH}						return 'PITCH';
{PLACEHOLDER_PITCH}			return 'PLACEHOLDER_PITCH';
//{UNSIGNED}					return 'POST_UNSIGNED';

{FRACTION}					return 'FRACTION';
//{REAL}						return 'REAL';
{UNSIGNED}					return 'UNSIGNED';

//{INT}						return 'INT';

// CHORD_MODIFIER
[m][a][j](?=[\W\d])			return 'CHORD_MODIFIER_WORD';
m(?=[\W\d])					return 'CHORD_MODIFIER_WORD';
[a][u][g](?=[\W\d])			return 'CHORD_MODIFIER_WORD';
[d][i][m](?=[\W\d])			return 'CHORD_MODIFIER_WORD';
[s][u][s](?=[\W\d])			return 'CHORD_MODIFIER_WORD';

{SYMBOL}					return 'SYMBOL';

"#f"						return 'SCM_FALSE';
"#t"						return 'SCM_TRUE';

"#x"[\da-fA-F]+				return 'SCM_HEX';

"#:"{SYMBOL}				return 'SCM_COLON';

"\\("						return yytext;
"\\)"						return yytext;

\.(?=\d)					return 'DOT_NUMBER_R';
//(?<=\d)\.					return 'DOT_NUMBER_L';

{SPECIAL}					return yytext;
\|							return 'DIVIDE';

[()]						return yytext;

"["							return yytext;
"]"							return yytext;

"#"							return yytext;
"~"							return yytext;

.							return 'UNKNOWN_CHAR';

<<EOF>>						return 'EOF';


/lex

%start start_symbol

%%

start_symbol
	: lilypond EOF
		{ return $1; }
	//| embedded_lilypond
	;

lilypond
	: %empty
		{$$ = root();}
	| version
		{$$ = root([$1]);}
	| lilypond toplevel_expression
		{$$ = appendSection($1, $2);}
	| lilypond assignment
		{$$ = appendSection($1, $2);}
	;

version
	: CMD_VERSION literal_string
		{$$ = command($1, $2);}
	;

toplevel_expression
	: header_block
		{$$ = $1;}
	| composite_music
		{$$ = $1;}
	| full_markup
		{$$ = $1;}
	| output_def
		{$$ = $1;}
	| score_block
		{$$ = $1;}
	| book_block
		{$$ = $1;}
	| scm_identifier
		{$$ = $1;}
	//| full_markup_list
	//	{$$ = $1;}
	//| bookpart_block
	//| BOOK_IDENTIFIER
	//| SCM_TOKEN
	//| embedded_scm_active
	;

score_block
	: SCORE '{' score_body '}'
		{$$ = block("score", $1, $3);}
	;

book_block
	: BOOK '{' book_body '}'
		{$$ = block("book", $1, $3);}
	;

book_body
	: %empty
		{$$ = [];}
	//| BOOK_IDENTIFIER
	| book_body paper_block
		{$$.push($2);}
	//| book_body bookpart_block
	//	{$$.push($2);}
	| book_body score_block
		{$$.push($2);}
	| book_body composite_music
		{$$.push($2);}
	| book_body full_markup
		{$$.push($2);}
	| book_body full_markup_list
		{$$.push($2);}
	//| book_body SCM_TOKEN
	| book_body embedded_scm_active
		{$$.push($2);}
	| book_body lilypond_header
		{$$.push($2);}
	//| book_body error
	;

paper_block
	: output_def
		{$$ = $1;}
	;

header_block
	: lilypond_header
		{$$ = $1;}
	;

lilypond_header
	: HEADER '{' lilypond_header_body '}'
		{$$ = block("header", $1, $3);}
	;

lilypond_header_body
	: %empty
		{$$ = [];}
	| lilypond_header_body assignment
		{$$.push($2);}
	//| lilypond_header_body SCM_TOKEN
	//| lilypond_header_body embedded_scm_active
	;

assignment
	: assignment_id '=' identifier_init
		{$$ = assignment($1, $3);}
	| assignment_id '.' property_path '=' identifier_init
		{$$ = assignment($1 + "." + $3, $5);}
	//| markup_mode_word '=' identifier_init
	;

assignment_id
	: literal_string
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	// extra formula
	| PITCH
		{$$ = $1;}
	// extra formula
	| CHORD_MODIFIER_WORD
		{$$ = $1;}
	;

property_path
	: symbol_list_rev
		{$$ = $1;}
	;

symbol_list_rev
	: symbol_list_part
		{$$ = $1;}
	| symbol_list_rev '.' symbol_list_part
		{$$ = $1 + "." + $3;}
	| symbol_list_rev ',' symbol_list_part
		{$$ = $1 + "," + $3;}
	;

symbol_list_part
	: symbol_list_part_bare
		{$$ = $1;}
	| embedded_scm_bare
		{$$ = $1;}
	;

symbol_list_part_bare
	: SYMBOL
		{$$ = $1;}
	| symbol_list_element
		{$$ = $1;}
	;

symbol_list_element
	: literal_string
		{$$ = $1;}
	| UNSIGNED
		{$$ = $1;}
	;

identifier_init
	: identifier_init_nonumber
		{$$ = $1;}
	| number_expression
		{$$ = $1;}
	//| symbol_list_part_bare '.' property_path
	//	{$$ = $1 + "." + $3;}
	//| symbol_list_part_bare ',' property_path
	//	{$$ = $1 + "," + $3;}
	| post_event_nofinger post_events
		{$$ = [$1, $2];}
	;

number_expression
	: number_expression '+' number_term
	| number_expression '-' number_term
	| number_term
	;

number_term
	: number_factor
	| number_factor '*' number_factor
	| number_factor '/' number_factor
	;

number_factor
	: '-'  number_factor
	| bare_number
	;

identifier_init_nonumber
	: header_block
		{$$ = $1;}
	| music_assign
		{$$ = $1;}
	//| full_markup_list
	//	{$$ = $1;}
	| string
		{$$ = $1;}
	| pitch_or_music
		{$$ = $1;}
	| FRACTION
		{$$ = $1;}
	| embedded_scm
		{$$ = $1;}
	| score_block
		{$$ = $1;}
	| output_def
		{$$ = $1;}
	| context_modification
		{$$ = $1;}
	| book_block
		{$$ = $1;}
	//| bookpart_block
	//| context_def_spec_block
	//| partial_markup
	//| partial_function ETC
	;

string
	: literal_string
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| full_markup
		{$$ = $1;}
	;

text
	: literal_string
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| full_markup
		{$$ = $1;}
	| embedded_scm_bare
		{$$ = $1;}
	;

full_markup_list
	: MARKUPLIST
		{$$ = $1;}
	| markup_list
		{$$ = $1;}
	;

markup_list
	: markup_composed_list
		{$$ = $1;}
	| markup_uncomposed_list
		{$$ = [$1];}
	;

markup_composed_list
	: markup_head_1_list markup_uncomposed_list
		//{$$ = block("markup", $1, $2);}
		{$$ = [...$1, $2];}
	;

markup_head_1_list
	: markup_head_1_item
		{$$ = [$1];}
	| markup_head_1_list markup_head_1_item
		{$$ = $1.concat([$2]);}
	;

markup_head_1_item
	//: markup_function EXPECT_MARKUP markup_command_list_arguments
	//: markup_function markup_command_list_arguments
	//	{$$ = {func: $1, args: $2};}
	: markup_function
		//{$$ = {func: $1};}
		{$$ = $1;}
	;

// equivalent for MARKUP_FUNCTION in lilypond's parser.yy
markup_function
	//: CMD_COLUMN
	//	{$$ = $1;}
	: CMD_LINE
		{$$ = $1;}
	//| CMD_BOLD
	//	{$$ = $1;}
	//| CMD_ITALIC
	//	{$$ = $1;}
	//| markup_font_size
	//	{$$ = $1;}
	| CMD_BOX
		{$$ = $1;}
	| CMD_WHITEOUT
		{$$ = $1;}
	| CMD_DYNAMIC
		{$$ = $1;}
	//| CMD_CENTER_COLUMN
	//	{$$ = $1;}
	//| CMD_WITH_URL
	//	{$$ = $1;}
	//| CMD_SANS
	//	{$$ = $1;}
	//| CMD_CONCAT
	//	{$$ = $1;}
	| CMD_MAINTAINER
		{$$ = $1;}
	;

// extra syntax
markup_font_size
	: CMD_HUGE
		{$$ = $1;}
	| CMD_LARGE
		{$$ = $1;}
	| CMD_NORMALSIZE
		{$$ = $1;}
	| CMD_SMALL
		{$$ = $1;}
	| CMD_TINY
		{$$ = $1;}
	| CMD_TEENY
		{$$ = $1;}
	;

markup_uncomposed_list
	: markup_braced_list
		{$$ = $1;}
	//| markup_command_list
	//| markup_scm MARKUPLIST_IDENTIFIER
	//| SCORELINES '{' score_body '}'
	;

markup_braced_list
	: '{' markup_braced_list_body '}'
		{$$ = inlineBlock($2);}
	;

markup_braced_list_body
	: %empty
		{$$ = [];}
	| markup_braced_list_body markup
		{$$ = $1.concat([$2]);}
	| markup_braced_list_body markup_list
		{$$ = $1.concat($2);}
	;

markup
	: markup_head_1_list simple_markup
		//{$$ = $1.concat([$2]);}
		{$$ = markup($1, $2);}
	| simple_markup
		{$$ = $1;}
	;

simple_markup
	: markup_word
		{$$ = $1;}
	| simple_markup_noword
		{$$ = $1;}
	;

markup_word
	: literal_string
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| unsigned_number
		{$$ = $1;}
	// extra formula
	| zero_command
		{$$ = $1;}
	| unitary_cmd number_expression
		{$$ = command($1, $2);}
	| CMD_NATURAL
		{$$ = $1;}
	| scm_identifier
		{$$ = $1;}
	// extra formula
	| music_property_def
		{$$ = $1;}
	| context_change
		{$$ = $1;}
	| pitch_mode_music
		{$$ = $1;}
	// extra formula
	| PITCH
		{$$ = $1;}
	// extra formula
	| REAL
		{$$ = $1;}
	// extra formula
	| INT
		{$$ = $1;}
	// extra formula
	| general_text
		{$$ = $1;}
	;

// extra syntax
general_text
	: CHORD_MODIFIER_WORD
		{$$ = $1;}
	| "."
		{$$ = $1;}
	| "-"
		{$$ = $1;}
	| "_"
		{$$ = $1;}
	| HYPHEN
		{$$ = $1;}
	| "="
		{$$ = $1;}
	| "'"
		{$$ = $1;}
	| ","
		{$$ = $1;}
	| ":"
		{$$ = $1;}
	| "/"
		{$$ = $1;}
	| "("
		{$$ = $1;}
	| ")"
		{$$ = $1;}
	| "*"
		{$$ = $1;}
	| "~"
		{$$ = $1;}
	| "!"
		{$$ = $1;}
	| "?"
		{$$ = $1;}
	| UNKNOWN_CHAR
		{$$ = $1;}
	| PLACEHOLDER_PITCH
		{$$ = $1;}
	;

simple_markup_noword
	: SCORE '{' score_body '}'
		//{$$ = {score: $3};}
		{$$ = block("score", $1, $3);}
	| markup_function markup_command_basic_arguments
		//{$$ = {func: $1, args: $2};}
		{$$ = command($1, ...$2);}
	//| markup_scm MARKUP_IDENTIFIER
	// extra formula
	| OVERRIDE scm_identifier
		{$$ = command($1, $2);}
	// extra formula
	| CMD_ABS_FONTSIZE scm_identifier markup
		{$$ = command($1, $2, $3);}
	// extra formula
	| CMD_ABS_FONTSIZE scm_identifier markup_list
		{$$ = command($1, $2, ...$3);}
	// extra formula
	| CMD_WITH_COLOR scm_identifier markup
		{$$ = command($1, $2, $3);}
	// extra formula
	| CMD_CHAR scm_identifier
		{$$ = command($1, $2);}
	// extra formula
	| CMD_SANS markup
		{$$ = command($1, $2);}
	// extra formula
	| CMD_SANS markup_list
		{$$ = command($1, ...$2);}
	// extra formula
	| CMD_CONCAT markup_list
		{$$ = command($1, ...$2);}
	// extra formula
	| CMD_COLUMN markup_list
		{$$ = command($1, ...$2);}
	// extra formula
	| CMD_CENTER_COLUMN markup_list
		{$$ = command($1, ...$2);}
	// extra formula
	| CMD_RIGHT_COLUMN markup_list
		{$$ = command($1, ...$2);}
	// extra formula
	| CMD_FOOTNOTE string string
		{$$ = command($1, $2, $3);}
	// extra formula
	| CMD_WITH_URL scalar string
		{$$ = command($1, $2, $3);}
	// extra formula
	| CMD_WITH_URL scalar markup_list
		{$$ = command($1, $2, ...$3);}
	// extra formula
	| CMD_BOLD markup_list
		{$$ = command($1, ...$2);}
	// extra formula
	| CMD_BOLD markup
		{$$ = command($1, $2);}
	// extra formula
	| markup_font_size markup
		{$$ = command($1, $2);}
	// extra formula
	| markup_font_size markup_list
		{$$ = command($1, ...$2);}
	// extra formula
	| CMD_ITALIC markup
		{$$ = command($1, $2);}
	// extra formula
	| CMD_ITALIC markup_list
		{$$ = command($1, ...$2);}
	;

markup_command_basic_arguments
	: %emtpy
		{$$ = [];}
	| /*EXPECT_MARKUP_LIST*/ markup_command_list_arguments markup_list
		{$$ = $1.concat($2);}
	| /*EXPECT_SCM*/ markup_command_list_arguments markup_command_embedded_lilypond
		{$$ = $1.concat($2);}
	//| EXPECT_SCM markup_command_list_arguments embedded_scm
	//| EXPECT_SCM markup_command_list_arguments mode_changed_music
	//| EXPECT_SCM markup_command_list_arguments MUSIC_IDENTIFIER
	//| EXPECT_SCM markup_command_list_arguments literal_string
	//| EXPECT_NO_MORE_ARGS
	;

markup_command_list_arguments
	: markup_command_basic_arguments
		{$$ = [$1];}
	| /*EXPECT_MARKUP*/ markup_command_list_arguments markup
		{$$ = $1.concat($2);}
	;

markup_command_embedded_lilypond
	: '{' embedded_lilypond '}'
		{$$ = $2;}
	;

embedded_lilypond
	: %empty
		{$$ = $1;}
	| identifier_init_nonumber
		{$$ = $1;}
	| embedded_lilypond_number
		{$$ = $1;}
	| post_event
		{$$ = $1;}
	//| duration post_events %prec ':'
	| music_embedded music_embedded music_list
		{$$ = [$1, $2, $3];}
	//| error
	//| INVALID embedded_lilypond
	;

embedded_lilypond_number
	: '-' embedded_lilypond_number
		{$$ = -$1;}
	| bare_number_common
		{$$ = $1;}
	//| UNSIGNED NUMBER_IDENTIFIER
	;

bare_number_common
	: REAL
		{$$ = Number($1);}
	//| NUMBER_IDENTIFIER
	//| REAL NUMBER_IDENTIFIER
	| number_identifier
		{$$ = $1;}
	| FRACTION
		{$$ = $1;}
	;

// extra syntax
dot
	: "."
		{$$ = $1;}
	| DOT_NUMBER_R
		{$$ = $1;}
	;

INT
	: UNSIGNED
		{$$ = Number($1);}
	| "-" UNSIGNED
		{$$ = -Number($2);}
	;

// extra syntax
positive_real
	: UNSIGNED DOT_NUMBER_R UNSIGNED
		{$$ = Number($1 + $2 + $3);}
	//| UNSIGNED DOT_NUMBER_L
	//	{$$ = Number($1 + $2);}
	| DOT_NUMBER_R UNSIGNED
		{$$ = Number($1 + $2);}
	;

REAL
	: positive_real
		{$$ = $1;}
	| "-" positive_real
		{$$ = -$2;}
	;

// equivalent for NUMBER_IDENTIFIER in lilypond's parser.yy
number_identifier
	: REAL number_unit
		{$$ = numberUnit($1, $2);}
	//| INT number_unit
	//	{$$ = numberUnit($1, $2);}
	| UNSIGNED number_unit
		{$$ = numberUnit($1, $2);}
	;

// addon term to construct number_identifier
number_unit
	: CENTIMETER
		{$$ = $1;}
	| MILLIMETER
		{$$ = $1;}
	;

score_body
	: score_items
		{$$ = $1;}
	//| score_body error
	;

score_items
	: %empty
		{$$ = [];}
	| score_items score_item
		{$$ = $1.concat([$2]);}
	| score_items lilypond_header
		{$$ = $1.concat([$2]);}
	;

score_item
	: music
		{$$ = $1;}
	| output_def
		{$$ = $1;}
	//: embedded_scm
	;

//markup_command_list
//	: MARKUP_LIST_FUNCTION markup_command_list_arguments
//	;

markup_scm
	: embedded_scm
		{$$ = $1;}
	;

embedded_scm
	: embedded_scm_bare
		{$$ = $1;}
	//| scm_function_call
	//| lookup
	;

scm_function_call
	: SCM_FUNCTION function_arglist
	;

function_arglist
	: function_arglist_nonbackup
		{$$ = $1;}
	//| EXPECT_OPTIONAL EXPECT_SCM function_arglist_skip_nonbackup DEFAULT
	;

function_arglist_nonbackup
	: function_arglist_common
	//| EXPECT_OPTIONAL EXPECT_SCM function_arglist_nonbackup post_event_nofinger
	//| EXPECT_OPTIONAL EXPECT_SCM function_arglist_nonbackup '-' UNSIGNED
	//| EXPECT_OPTIONAL EXPECT_SCM function_arglist_nonbackup '-' REAL
	//| EXPECT_OPTIONAL EXPECT_SCM function_arglist_nonbackup '-' NUMBER_IDENTIFIER
	//| EXPECT_OPTIONAL EXPECT_SCM function_arglist_nonbackup embedded_scm_arg
	//| EXPECT_OPTIONAL EXPECT_SCM function_arglist_nonbackup bare_number_common
	| function_arglist_nonbackup_reparse REPARSE pitch_or_music
	| function_arglist_nonbackup_reparse REPARSE duration
	| function_arglist_nonbackup_reparse REPARSE reparsed_rhythm
	| function_arglist_nonbackup_reparse REPARSE bare_number_common
	| function_arglist_nonbackup_reparse REPARSE SCM_ARG
	| function_arglist_nonbackup_reparse REPARSE lyric_element_music
	| function_arglist_nonbackup_reparse REPARSE symbol_list_arg
	;

function_arglist_common
	//: EXPECT_NO_MORE_ARGS
	: %empty
	//| EXPECT_SCM function_arglist_optional embedded_scm_arg
	//| EXPECT_SCM function_arglist_optional bare_number_common
	//| EXPECT_SCM function_arglist_optional post_event_nofinger
	//| EXPECT_SCM function_arglist_optional '-' NUMBER_IDENTIFIER
	| function_arglist_common_reparse REPARSE SCM_ARG
	| function_arglist_common_reparse REPARSE lyric_element_music
	| function_arglist_common_reparse REPARSE pitch_or_music
	| function_arglist_common_reparse REPARSE bare_number_common
	| function_arglist_common_reparse REPARSE duration
	| function_arglist_common_reparse REPARSE reparsed_rhythm
	| function_arglist_common_reparse REPARSE symbol_list_arg
	;

lookup
	: LOOKUP_IDENTIFIER
		{$$ = $1;}
	| LOOKUP_IDENTIFIER '.' symbol_list_rev
		{$$ = $1 + "." + $2;}
	;

symbol_list_part
	: symbol_list_part_bare
		{$$ = $1;}
	| embedded_scm_bare
		{$$ = $1;}
	;

embedded_scm_bare
	//: SCM_TOKEN
	//| SCM_IDENTIFIER
	: scm_identifier
		{$$ = $1;}
	;

// equivalent for SCM_IDENTIFIER in lilypond parser.yy
scm_identifier
	//: SCM_FALSE
	//	{$$ = scheme(false);}
	//| SCM_TRUE
	//	{$$ = scheme(true);}
	//| SCM_INT
	//	{$$ = scheme($1.substr(1));}
	//| "#" "'" SYMBOL
	//	{$$ = scheme("'" + $3);}
	: "#" scheme_expression
		{$$ = scheme($2);}
	| DOLLAR_SCHEME_EXPRESSION
		{$$ = $1;}
	;

composite_music
	: basic_music
		{$$ = $1;}
	| contexted_basic_music
		{$$ = $1;}
	//| basic_music new_lyrics
	;

contexted_basic_music
	: context_prefix contextable_music new_lyrics
		{$$ = contextedMusic($1, $2, $3);}
	| context_prefix contextable_music
		{$$ = contextedMusic($1, $2);}
	| context_prefix contexted_basic_music
		{$$ = contextedMusic($1, $2);}
	;

contextable_music
	: basic_music
		{$$ = $1;}
	| pitch_as_music
		{$$ = $1;}
	| event_chord
		{$$ = $1;}
	;

new_lyrics
	: ADDLYRICS optional_context_mods lyric_mode_music
		{$$ = [{addLyrics: $3, mods: $2}];}
	| new_lyrics ADDLYRICS optional_context_mods lyric_mode_music
		{$$ = $1.concat([{addLyrics: $4, mods: $3}]);}
	;

lyric_mode_music
	: grouped_music_list
		{$$ = $1;}
	//| MUSIC_IDENTIFIER
	| music_identifier
		{$$ = $1;}
	;

context_prefix
	: CONTEXT symbol optional_id optional_context_mods
		//{$$ = {context: $2, assign: $3, mods: $4};}
		{$$ = command($1, $2, $3, ...$4);}
	| NEWCONTEXT symbol optional_id optional_context_mods
		//{$$ = {context: $2, new: true, assign: $3, mods: $4};}
		{$$ = command($1, $2, $3, ...$4);}
	;

optional_id
	: %empty
		{$$ = null;}
	| '=' simple_string
		{$$ = assignment(null, $2);}
	;

optional_context_mods
	: context_modification_mods_list
		{$$ = $1;}
	;

context_modification_mods_list
	: %empty
		{$$ = [];}
	| context_modification_mods_list context_modification
		{$$ = $1.concat($2);}
	;

basic_music
	: repeated_music
		{$$ = $1;}
	| music_bare
		{$$ = $1;}
	| LYRICSTO simple_string lyric_mode_music
		{$$ = command($1, $2, $3);}
	| LYRICSTO symbol '=' simple_string lyric_mode_music
		{$$ = command($1, assignment($2, $4), $5);}
	;

music_bare
	: grouped_music_list
		{$$ = $1;}
	| music_identifier
		{}
	| mode_changed_music
		{$$ = $1;}
	;

mode_changed_music
	: mode_changing_head grouped_music_list
		{$$ = command($1, $2);}
	| mode_changing_head_with_context optional_context_mods grouped_music_list
		{$$ = command($1, ...$2, $3);}
	// extra formula
	| CHORDMODE chordmode_braced_music_list
		{$$ = command($1, $2);}
	;

// extra syntax
chordmode_braced_music_list
	: '{' chordmode_music_list '}'
		{$$ = musicBlock($2);}
	;

// extra syntax
chordmode_music_list
	: %empty
		{$$ = [];}
	| chordmode_music_list chordmode_music
		{$$ = $1.concat([$2]);}
	;

// extra syntax
chordmode_music
	: new_chord post_events
		{$$ = briefChord($1, {post_events: $2, locations: [@1, @2]});}
	| music_assign
		{$$ = $1;}
	| chordmode_repeated_music
		{$$ = $1;}
	| chordmode_braced_music_list
		{$$ = $1;}
	;

// extra syntax
chordmode_repeated_music
	: REPEAT simple_string unsigned_number chordmode_braced_music_list
		{$$ = command($1, $2, $3, $4);}
	| REPEAT simple_string unsigned_number chordmode_braced_music_list ALTERNATIVE chordmode_braced_music_list
		{$$ = command($1, $2, $3, $4, command($5, $6));}
	;

mode_changing_head_with_context
	: DRUMS
		{$$ = $1;}
	| FIGURES
		{$$ = $1;}
	| CHORDS
		{$$ = $1;}
	| LYRICS
		{$$ = $1;}
	;

mode_changing_head
	: NOTEMODE
		{$$ = $1;}
	| DRUMMODE
		{$$ = $1;}
	| FIGUREMODE
		{$$ = $1;}
	//| CHORDMODE
	//	{$$ = $1;}
	| LYRICMODE
		{$$ = $1;}
	;

grouped_music_list
	: sequential_music
		{$$ = $1;}
	| simultaneous_music
		{$$ = $1;}
	;

simultaneous_music
	: SIMULTANEOUS braced_music_list
		{$$ = command($1, $2);}
	//| DOUBLE_ANGLE_OPEN music_list DOUBLE_ANGLE_CLOSE
	//	{$$ = simultaneousList($2);}
	| DOUBLE_ANGLE_OPEN multiple_voices_music_list DOUBLE_ANGLE_CLOSE
		{$$ = simultaneousList($2);}
	;

// extra syntax
multiple_voices_music_list
	: music_list
		{$$ = $1;}
	| multiple_voices_music_list E_BACKSLASH music_embedded
		{$$ = [...$1, $2, $3];}
	;

sequential_music
	: SEQUENTIAL braced_music_list
		{$$ = command($2);}
	| braced_music_list
		{$$ = $1;}
	;

braced_music_list
	: '{' music_list '}'
		{$$ = musicBlock($2);}
	;

music_list
	: %empty
		{$$ = [];}
	| music_list music_embedded
		{$$ = $1.concat([$2]);}
	;

music_embedded
	: music
		{$$ = $1;}
	| post_event
		{$$ = $1;}
	| music_embedded_backup
		{$$ = $1;}
	//| music_embedded_backup BACKUP lyric_element_music
	//| duration post_events %prec ':'
	;

music_embedded_backup
	: embedded_scm
		{$$ = $1;}
	;

music
	: music_assign
		{$$ = $1;}
	| pitch_as_music
		{$$ = $1;}
	| lyric_element_music
	;

// extra syntax
variable_command
	: COMMAND
		{$$ = variable($1);}
	;

lyric_element_music
	: lyric_element optional_notemode_duration post_events
		{$$ = lyric($1, {duration: $2, post_events: $3, locations: [@1, @3]});}
	// extra formula
	| variable_command optional_notemode_duration post_events
		{$$ = lyric($1, {duration: $2, post_events: $3, locations: [@1, @3]});}
	;

lyric_element
	: full_markup
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| literal_string
		{$$ = $1;}
	//| LYRIC_ELEMENT
	// extra formula
	//| general_text
	//	{$$ = $1;}
	// extra formula
	| ","
		{$$ = $1;}
	// extra formula
	| "."
		{$$ = $1;}
	// extra formula
	| "?"
		{$$ = $1;}
	// extra formula
	| "!"
		{$$ = $1;}
	// extra formula
	| "'"
		{$$ = $1;}
	// extra formula
	| CHORD_MODIFIER_WORD
		{$$ = $1;}
	| UNKNOWN_CHAR
		{$$ = $1;}
	;

pitch_as_music
	: pitch_or_music
		{$$ = $1;}
	;

music_assign
	: simple_music
		{$$ = $1;}
	| composite_music
		{$$ = $1;}
	;

simple_music
	: event_chord
		{$$ = $1;}
	| music_property_def
		{$$ = $1;}
	| context_change
		{$$ = $1;}
	;

context_change
	: CHANGE symbol '=' simple_string
		{$$ = command($1, assignment($2, $4));}
	;

music_property_def
	: OVERRIDE grob_prop_path '=' scalar
		{$$ = command($1, assignment($2, $4));}
	// extra formula
	| OVERRIDEPROPERTY grob_prop_spec scm_identifier
		{$$ = command($1, $2, $3);}
	//| REVERT simple_revert_context revert_arg
	//	{$$ = command($1, $2, $3);}
	| REVERT revert_arg
		{$$ = command($1, $2);}
	| SET context_prop_spec '=' scalar
		{$$ = command($1, assignment($2, $4));}
	| UNSET context_prop_spec
		{$$ = command($1, $2);}
	;

revert_arg
	//: revert_arg_backup BACKUP symbol_list_arg
	: revert_arg_backup
		{$$ = $1;}
	// extra formula
	| revert_arg_backup symbol_list_arg
		{$$ = [$1, $2];}
	;

revert_arg_backup
	: revert_arg_part
		{$$ = $1;}
	;

revert_arg_part
	: symbol_list_part
		{$$ = $1;}
	| revert_arg_backup '.' symbol_list_part
		{$$ = $1 + "." + $3;}
	//| revert_arg_backup BACKUP SCM_ARG '.' symbol_list_part
	//| revert_arg_backup BACKUP SCM_ARG ',' symbol_list_part
	//| revert_arg_backup BACKUP SCM_ARG symbol_list_part
	;

symbol_list_arg
	: SYMBOL_LIST
		{$$ = $1;}
	| SYMBOL_LIST '.' symbol_list_rev
		{$$ = $1.toString() + $2 + $3.toString();}
	| SYMBOL_LIST ',' symbol_list_rev
		{$$ = $1.toString() + $2 + $3.toString();}
	;

// extra syntax
SYMBOL_LIST
	: symbol_list_part
		{$$ = $1;}
	;

simple_revert_context
	: symbol_list_part
		{$$ = $1;}
	;

grob_prop_path
	: grob_prop_spec
		{$$ = [$1];}
	| grob_prop_spec property_path
		{$$ = [$1, $2];}
	;

grob_prop_spec
	: symbol_list_rev
		{$$ = $1;}
	;

context_prop_spec
	: symbol_list_rev
		{$$ = $1;}
	;

event_chord
	: note_chord_element
		{$$ = $1;}
	| tempo_event
		{$$ = $1;}
	//| simple_element post_events
	//| CHORD_REPETITION optional_notemode_duration post_events
	//| MULTI_MEASURE_REST optional_notemode_duration post_events
	;

tempo_event
	: TEMPO steno_duration '=' tempo_range
		//{$$ = {tempo: $4, unit: $2};}
		{$$ = tempo($4, $2);}
	| TEMPO text steno_duration '=' tempo_range
		//{$$ = {tempo: $5, unit: $3, text: $2};}
		{$$ = tempo($5, $3, $2);}
	| TEMPO text
		{$$ = tempo(undefined, undefined, $2);}
	| TEMPO CMD_TEMPOLEGEND
		{$$ = tempo(undefined, undefined, $2);}
	;

tempo_range
	: unsigned_number
		{$$ = $1;}
	| unsigned_number '-' unsigned_number
		{$$ = {from: $1, to: $2};}
	;

simple_element
	//: DRUM_PITCH optional_notemode_duration
	: RESTNAME optional_notemode_duration	// TODO: resolve RESTNAME
		{$$ = $1 + $2;}
	;

optional_notemode_duration
	: %empty
		{$$ = null;}
	| duration
		{$$ = $1;}
	;

duration
	: steno_duration multipliers
		//{$$ = $1 + $2;}
		{$$ = duration({...$1, multipliers: $2});}
	;

steno_duration
	: unsigned_number dots
		//{$$ = $1 + $2;}
		{$$ = duration({number: $1, dots: $2.length});}
	| DURATION_IDENTIFIER dots
		{$$ = duration({number: $1, dots: $2.length});}
	;

DURATION_IDENTIFIER
	: CMD_BREVE
		{$$ = $1;}
	| CMD_LONGA
		{$$ = $1;}
	;

dots
	: %empty
		{$$ = "";}
	| dots dot
		{$$ = $1 + $2;}
	;

multipliers
	: %empty
		{$$ = [];}
	| multipliers '*' unsigned_number
		{$$ = [...$1, $3];}
	| multipliers '*' FRACTION
		{$$ = [...$1, $3];}
	//| multipliers '*' multiplier_scm
	;

repeated_music
	: REPEAT simple_string unsigned_number music
		{$$ = command($1, $2, $3, $4);}
	| REPEAT simple_string unsigned_number music ALTERNATIVE braced_music_list
		{$$ = command($1, $2, $3, $4, command($5, $6));}
	;

unsigned_number
	: UNSIGNED
		{$$ = $1;}
	//| POST_UNSIGNED
	//	{$$ = $1;}
	//| NUMBER_IDENTIFIER
	//| embedded_scm
	;

simple_string
	: literal_string
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	;

// all kinds commands in music list, seems named as MUSIC_IDENTIFIER in lilypond's parser.yy
music_identifier
	: zero_command
		{$$ = $1;}
	| unitary_cmd value
		{$$ = command($1, $2);}
	| CMD_PARTIAL duration
		{$$ = command($1, $2);}
	| CMD_TUPLETSPAN duration
		{$$ = command($1, $2);}
	| CMD_TUPLETSPAN DEFAULT
		{$$ = command($1, $2);}
	| CMD_TUPLET FRACTION music
		{$$ = command($1, $2, $3);}
	| CMD_TUPLET FRACTION duration music
		{$$ = command($1, $2, $3, $4);}
	//| binary_cmd value value
	//	{$$ = command($1, [$2, $3]);}
	| CMD_TWEAK property_path value
		{$$ = command($1, $2, $3);}
	| CMD_KEY PITCH COMMAND
		{$$ = command($1, $2, $3);}
	| CMD_TIMES FRACTION music
		{$$ = command($1, $2, $3);}
	| CMD_AFTERGRACE music music
		{$$ = command($1, $2, $3);}
	| CMD_PARALLELMUSIC scm_identifier composite_music
		{$$ = command($1, $2, $3);}
	| CMD_SHAPE scm_identifier symbol
		{$$ = command($1, $2, $3);}
	| CMD_ACCIDENTALSTYLE grob_prop_spec
		{$$ = command($1, $2);}
	| CMD_NUMERICTIMESIGNATURE music_identifier
		{$$ = command($1, $2);}
	| markup_font_size music
		{$$ = command($1, $2);}
	| pitch_mode_music
		{$$ = $1;}
	| "("
		{$$ = $1;}
	| ")"
		{$$ = $1;}
	| "["
		{$$ = $1;}
	| "]"
		{$$ = $1;}
	| DIVIDE
		{$$ = {proto: "Divide"};}
	| expressive_mark
		{$$ = $1;}
	;

// extra syntax
zero_command
	: variable_command
		{$$ = $1;}
	//| CMD_WITH_URL
	//	{$$ = command($1);}
	| CMD_STEMUP
		{$$ = command($1);}
	| CMD_STEMDOWN
		{$$ = command($1);}
	| CMD_STEMNEUTRAL
		{$$ = command($1);}
	| CMD_MERGEDIFFERENTLYDOTTEDON
		{$$ = command($1);}
	| CMD_MERGEDIFFERENTLYHEADEDON
		{$$ = command($1);}
	| CMD_VOICE_NUMBER
		{$$ = command($1);}
	| CMD_SCORE
		{$$ = command($1);}
	| CMD_ARPEGGIO
		{$$ = command($1);}
	| CMD_ARPEGGIOARROWDOWN
		{$$ = command($1);}
	| CMD_ARPEGGIOARROWUP
		{$$ = command($1);}
	| CMD_ARPEGGIONORMAL
		{$$ = command($1);}
	| CMD_GLISSANDO
		{$$ = command($1);}
	| CMD_MORDENT
		{$$ = command($1);}
	| CMD_MUSICGLYPH
		{$$ = command($1);}
	| CMD_POWERCHORDS
		{$$ = command($1);}
	| CMD_PRALL
		{$$ = command($1);}
	| CMD_SUSTAINOFF
		{$$ = command($1);}
	| CMD_SUSTAINON
		{$$ = command($1);}
	| CMD_TRILL
		{$$ = command($1);}
	| CMD_TURN
		{$$ = command($1);}
	;

// extra syntax
expressive_mark
	: CMD_CRESCENDO_BEGIN
		{$$ = $1;}
	| CMD_DECRESCENDO_BEGIN
		{$$ = $1;}
	| CMD_DYNAMICS_END
		{$$ = $1;}
	| CMD_FERMATA
		{$$ = $1;}
	| CMD_TWEAK property_path scm_identifier
		{$$ = command($1, $2, $3);}
	| CMD_DYNAMIC_MARKINGS
		{$$ = command($1);}
	| "~"
		{$$ = $1;}
	| "("
		{$$ = $1;}
	| ")"
		{$$ = $1;}
	| "\("
		{$$ = $1;}
	| "\)"
		{$$ = $1;}
	;

/*binary_cmd
	;*/

// extra syntax
unitary_cmd
	: CMD_CLEF
		{$$ = $1;}
	| CMD_TIME
		{$$ = $1;}
	| CMD_STEMUP
		{$$ = $1;}
	| CMD_STEMDOWN
		{$$ = $1;}
	| CMD_STEMNEUTRAL
		{$$ = $1;}
	| CMD_BAR
		{$$ = $1;}
	| CMD_OMIT
		{$$ = $1;}
	| CMD_OTTAVA
		{$$ = $1;}
	| CMD_BARNUMBERCHECK
		{$$ = $1;}
	//| CMD_PARTIAL
	//	{$$ = $1;}
	| CMD_MARK
		{$$ = $1;}
	| CMD_INCLUDE
		{$$ = $1;}
	//| CMD_TUPLETSPAN
	//	{$$ = $1;}
	//| CMD_TUPLET
	//	{$$ = $1;}
	| CMD_SKIP
		{$$ = $1;}
	| CMD_PARENTHESIZE
		{$$ = $1;}
	| CMD_UNFOLDREPEATS
		{$$ = $1;}
	| CMD_GRACE
		{$$ = $1;}
	| CMD_ACCIACCATURA
		{$$ = $1;}
	| CMD_APPOGGIATURA
		{$$ = $1;}
	| CMD_SLASHEDGRACE
		{$$ = $1;}
	| CMD_LANGUAGE
		{$$ = $1;}
	| CMD_ONCE
		{$$ = $1;}
	;

// extra syntax
pitch_mode_music
	: pitch_mode pitch music
		{$$ = command($1, $2, $3);}
	| pitch_mode pitch COMMAND
		{$$ = command($1, $2, $3);}
	| pitch_mode music
		{$$ = command($1, null, $2);}
	;

// extra syntax
pitch_mode
	: CMD_RELATIVE
		{$$ = $1;}
	| CMD_ABSOLUTE
		{$$ = $1;}
	;

// extra syntax
value
	: music
		{$$ = $1;}
	| full_markup
		{$$ = $1;}
	| FRACTION
		{$$ = $1;}
	| UNSIGNED
		{$$ = $1;}
	//| INT
	//	{$$ = $1;}
	| REAL
		{$$ = $1;}
	| literal_string
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| scm_identifier
		{$$ = $1;}
	| SYMBOL '.' property_path
		{$$ = $1 + "." + $3;}
	;

pitch_or_music
	//: pitch exclamations questions octave_check maybe_notemode_duration erroneous_quotes optional_rest post_events
	: pitch exclamations questions optional_notemode_duration optional_rest post_events
		{$$ = chord([chordElem($1, {locations: [@1, @1]})], $4, {exclamations: $2, questions: $3, rest: $5, post_events: $6, locations: [@1, @6]});}
	//| new_chord post_events
	//	{$$ = briefChord($1, {post_events: $2});}
	;

new_chord
	//: steno_tonic_pitch maybe_notemode_duration
	: pitch optional_notemode_duration
		{$$ = {pitch: $1, duration: $2};}
	//| steno_tonic_pitch optional_notemode_duration chord_separator chord_items
	| pitch optional_notemode_duration chord_separator chord_items
		{$$ = {pitch: $1, duration: $2, separator: $3, items: $4};}
	;

chord_items
	: %empty
		{$$ = [];}
	| chord_items chord_item
		{$$ = $1.concat($2);}
	;

chord_item
	: chord_separator
		{$$ = $1;}
	| step_numbers
		{$$ = $1;}
	| CHORD_MODIFIER
		{$$ = $1;}
	;

// m, m7, dim, dim7, aug, maj, maj7
CHORD_MODIFIER
	: CHORD_MODIFIER_WORD
		{$$ = $1;}
	//| CHORD_MODIFIER_WORD UNSIGNED
	//	{$$ = $1 + $2;}
	;

step_numbers
	: step_number
		{$$ = $1;}
	| step_numbers dot step_number
		{$$ = $1 + $2 + $3;}
	;

step_number
	: UNSIGNED
		{$$ = $1;}
	| UNSIGNED '+'
		{$$ = $1 + $2;}
	| UNSIGNED CHORD_MINUS
		{$$ = $1 + $2;}
	;

maybe_notemode_duration
	: %empty
		{$$ = null;}
	| duration
		{$$ = $1;}
	;

steno_tonic_pitch
	: TONICNAME_PITCH quotes
		{$$ = $1 + $2;}
	;

CHORD_BASS
	: "/" "+"
		{$$ = $1 + $2;}
	;

CHORD_CARET
	: "^"
		{$$ = $1;}
	;

CHORD_COLON
	: ":"
		{$$ = $1;}
	;

CHORD_MINUS
	: "-"
		{$$ = $1;}
	;

CHORD_SLASH
	: "/"
		{$$ = $1;}
	;

chord_separator
	: CHORD_COLON
		{$$ = $1;}
	| CHORD_CARET
		{$$ = $1;}
	//| CHORD_SLASH steno_tonic_pitch
	| CHORD_SLASH pitch
		{$$ = $1 + $2;}
	//| CHORD_BASS steno_tonic_pitch
	| CHORD_BASS pitch
		{$$ = $1 + $2;}
	;

exclamations
	: %empty
		{$$ = [];}
	| exclamations '!'
		{$$ = $1.concat($2);}
	;

questions
	: %empty
		{$$ = [];}
	| questions '?'
		{$$ = $1.concat($2);}
	;

post_events
	: %empty
		{$$ = [];}
	| post_events post_event
		{$$ = $1.concat($2);}
	;

note_chord_element
	: chord_body optional_notemode_duration post_events
		{$$ = chord($1, $2, {withAngle: true, post_events: $3, locations: [@1, @2]});}
	;

chord_body
	: "<" chord_body_elements ">"
		{$$ = $2;}
	//| FIGURE_OPEN figure_list FIGURE_CLOSE
	;

chord_body_elements
	: %empty
		{$$ = [];}
	| chord_body_elements chord_body_element
		{$$ = $1.concat([$2]);}
	;

chord_body_element
	//: pitch_or_tonic_pitch exclamations questions octave_check post_events %prec ':'
	: pitch_or_tonic_pitch exclamations questions post_events
		//{$$ = $1 + $2 + $3 + $4;}
		{$$ = chordElem($1, {locations: [@1, @4], exclamations: $2, questions: $3, post_events: $4});}
	//| DRUM_PITCH post_events %prec ':' 
	| music_function_chord_body
		{$$ = $1;}
	//| post_event
	;

music_function_chord_body
	//: music_function_call
	//| MUSIC_IDENTIFIER
	//| embedded_scm
	: music_identifier
		{$$ = $1;}
	;

pitch_or_tonic_pitch
	: pitch
		{$$ = $1;}
	//| steno_tonic_pitch
	;

/*// extra syntax
pitches
	:	pitches pitch
		{$$ = $1.concat([$2]);}
	|	pitch
		{$$ = [$1];}
	;*/

pitch
	: PITCH quotes
		{$$ = $1 + $2;}
	//| steno_pitch
	// extra formula
	| PLACEHOLDER_PITCH
		{$$ = $1;}
	;

quotes
	: %empty
		{$$ = "";}
	| sub_quotes
		{$$ = $1;}
	| sup_quotes
		{$$ = $1;}
	;

sup_quotes
	: "'"
		{$$ = $1;}
	| sup_quotes "'"
		{$$ = $1 + $2;}
	;

sub_quotes
	: ","
		{$$ = $1;}
	| sub_quotes ","
		{$$ = $1 + $2;}
	;

post_event
	: post_event_nofinger
		{$$ = $1;}
	| '-' fingering
		//{$$ = {type: "fingering", direction: "middle", value: $2};}
		{$$ = postEvent("middle", fingering($2));}
	;

post_event_nofinger
	: '^' fingering
		//{$$ = {direction: "up", fingering: $2};}
		{$$ = postEvent("up", fingering($2));}
	| '_' fingering
		//{$$ = {direction: "down", fingering: $2};}
		{$$ = postEvent("down", fingering($2));}
	| direction_less_event
		{$$ = $1;}
	| script_dir music_function_call
		{$$ = postEvent($1, $2);}
	| HYPHEN
		{$$ = $1;}
	| EXTENDER
		{$$ = $1;}
	| script_dir direction_reqd_event
		{$$ = postEvent($1, $2);}
	| script_dir direction_less_event
		{$$ = postEvent($1, $2);}
	// extra formula
	| script_dir zero_command
		{$$ = postEvent($1, $2);}
	// extra formula
	| script_dir expressive_mark
		{$$ = postEvent($1, $2);}
	// extra formula
	| "["
		{$$ = $1;}
	// extra formula
	| "]"
		{$$ = $1;}
	// extra formula
	| script_dir "["
		{$$ = postEvent($1, $2);}
	// extra formula
	| script_dir "]"
		{$$ = postEvent($1, $2);}
	// extra formula
	| "("
		{$$ = $1;}
	// extra formula
	| ")"
		{$$ = $1;}
	;

direction_reqd_event
	: gen_text_def
		{$$ = $1;}
	| script_abbreviation
		{$$ = $1;}
	;

gen_text_def
	: full_markup
		{$$ = $1;}
	| literal_string
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| embedded_scm
		{$$ = $1;}
	;

script_abbreviation
	: '^'
		{$$ = $1;}
	| '+'
		{$$ = $1;}
	| '-' 
		{$$ = $1;}
 	| '!'
		{$$ = $1;}
	| '>'
		{$$ = $1;}
	| dot
		{$$ = $1;}
	| '_'
		{$$ = $1;}
	;

direction_less_event
	: string_number_event
		{$$ = $1;}
	//| EVENT_IDENTIFIER
	| tremolo_type
		{$$ = $1;}
	| event_function_event
		{$$ = $1;}
	;

string_number_event
	: E_UNSIGNED
		{$$ = $1;}
	;

tremolo_type
	: ':'
		{$$ = ":";}
	| ':' UNSIGNED
		{$$ = ":" + $2;}
	;

event_function_event
	: EVENT_FUNCTION function_arglist
	;

music_function_call
	: MUSIC_FUNCTION function_arglist
	;

script_dir
	: "_"
		{$$ = "down";}
	| "^"
		{$$ = "up";}
	| "-"
		{$$ = "middle";}
	;

fingering
	: UNSIGNED
		{$$ = $1;}
	;

full_markup
	: markup_mode markup_top
		{$$ = markupCommand($1, ...$2);}
	| markup_mode_word
		{$$ = $1;}
	;

markup_mode
	: MARKUP
		{$$ = $1;}
	;

markup_top
	: markup_list
		{$$ = $1;}
	| markup_head_1_list simple_markup
		//{$$ = {head: $1, body: $2};}
		{$$ = $1.concat([$2]);}
	| simple_markup_noword
		{$$ = [$1];}
	;

markup_mode_word
	: markup_mode markup_word
		{$$ = command($1, $2);}
	;

output_def
	: output_def_body '}'
		{$$ = $1;}
	;

output_def_body
	: output_def_head_with_mode_switch '{'
		{$$ = block("score", $1);}
	| output_def_body assignment
		{
			$1.body.push($2);
			$$ = $1;
		}
	| output_def_body music_or_context_def
		{
			$1.body.push($2);
			$$ = $1;
		}
	| output_def_body scm_identifier
		{
			$1.body.push($2);
			$$ = $1;
		}
	//| output_def_body embedded_scm_active
	//| output_def_body SCM_TOKEN
	//| output_def_body error
	;

output_def_head_with_mode_switch
	: output_def_head
		{$$ = $1;}
	;

output_def_head
	: PAPER
		{$$ = $1;}
	| MIDI
		{$$ = $1;}
	| LAYOUT
		{$$ = $1;}
	;

music_or_context_def
	: music_assign
		{$$ = $1;}
	| context_def_spec_block
		{$$ = $1;}
	;

context_def_spec_block
	: CONTEXT '{' context_def_spec_body '}'
		{$$ = block("context", $1, $3);}
	;

context_def_spec_body
	: %empty
		{$$ = [];}
	| context_def_spec_body context_mod
		{$$ = $1.concat([$2]);}
	| context_def_spec_body context_modification
		{$$ = $1.concat([$2]);}
	| context_def_spec_body context_mod_arg
		{$$ = $1.concat([$2]);}
	;

context_mod_arg
	: embedded_scm
		{$$ = $1;}
	| composite_music
		{$$ = $1;}
	;

context_modification
	: WITH '{' context_mod_list '}'
		{$$ = command($1, inlineBlock($3));}
	| WITH context_modification_arg
		{$$ = command($1, $2);}
	;

context_modification_arg
	: embedded_scm
		{$$ = $1;}
	//| MUSIC_IDENTIFIER
	| music_identifier
		{$$ = $1;}
	;

context_mod_list
	: %empty
		{$$ = [];}
	| context_mod_list context_mod
		{$$ = $1.concat($2);}
	| context_mod_list context_mod_arg
		{$$ = $1.concat($2);}
	;

context_mod
	: property_operation
		{$$ = $1;}
	//| context_def_mod SYMBOL
	| context_def_mod symbol
		{$$ = command($1, $2);}
	//| context_def_mod embedded_scm
	;

property_operation
	: symbol '=' scalar
		{$$ = assignment($1, $3);}
	| UNSET symbol
		{$$ = command($1, $2);}
	| OVERRIDE revert_arg '=' scalar
		{$$ = command($1, assignment($2, $4));}
	| REVERT revert_arg
		{$$ = command($1, $2);}
	;

symbol
	: literal_string
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| embedded_scm_bare
		{$$ = $1;}
	;

scalar
	//: embedded_scm_arg
	: pitch_or_music
		{$$ = $1;}
	| scm_identifier
		{$$ = $1;}
	| bare_number
		{$$ = $1;}
	| '-' bare_number
		{$$ = -$1;}
	| string
		{$$ = $1;}
	| symbol_list_part_bare '.' property_path
		{$$ = $1 + "." + $3;}
	| symbol_list_part_bare ',' property_path
		{$$ = $1 + "," + $3;}
	// extra formula
	| UNSIGNED ',' property_path
		{$$ = $1 + "," + $3;}
	// extra formula
	| COMMAND
		{$$ = $1;}
	;

bare_number
	: bare_number_common
		{$$ = $1;}
	| UNSIGNED
		{$$ = Number($1);}
	//| UNSIGNED NUMBER_IDENTIFIER
	;

context_def_mod
	: CONSISTS
		{$$ = $1;}
	| REMOVE
		{$$ = $1;}
	| ACCEPTS
		{$$ = $1;}
	| DEFAULTCHILD
		{$$ = $1;}
	| DENIES
		{$$ = $1;}
	| ALIAS
		{$$ = $1;}
	| TYPE
		{$$ = $1;}
	| DESCRIPTION
		{$$ = $1;}
	| NAME
		{$$ = $1;}
	;

embedded_scm_active
	//: SCM_IDENTIFIER
	: scm_identifier
		{$$ = $1;}
	| scm_function_call
		{$$ = $1;}
	| lookup
		{$$ = $1;}
	;


/*// extra syntax, maybe the substitution for embedded_scm_active in lilypond's parser
embedded_scheme_expression
	: "#" scheme_expression
		{$$ = scheme($2);}
	;*/

// extra syntax
scheme_expression
	: SCM_TRUE
		{$$ = true;}
	| SCM_FALSE
		{$$ = false;}
	| SCM_HEX
		{$$ = $1}
	| SCM_COLON
		{$$ = $1}
	| bare_number
		{$$ = $1;}
	| INT
		{$$ = $1;}
	| "(" ")"
		{$$ = null;}
	| "(" scheme_expression "." scheme_expression ")"
		{$$ = schemePair($2, $4);}
	| "(" scheme_expression scheme_args ")"
		{$$ = schemeFunction($2, $3);}
	| scheme_token
		{$$ = $1;}
	| scheme_token "?"
		{$$ = $1 + $2;}
	| "'" scheme_expression
		{$$ = schemePointer($2);}
	| "#" "{" lilypond "#" "}"
		{$$ = schemeEmbed($3);}
	;

scheme_args
	: %empty
		{$$ = [];}
	| scheme_args scheme_expression
		{$$ = $1.concat($2);}
	;

scheme_token
	: bare_number
		{$$ = $1;}
	| symbol
		{$$ = $1;}
	| symbol ":" scheme_token
		{$$ = $1 + $2 + $3;}
	| symbol ":" ":" scheme_token
		{$$ = $1 + $2 + $3 + $4;}
	;

optional_rest
	: %empty
		{$$ = null;}
	| REST
		{$$ = $1;}
	;

// extra syntax, the substitution of STRING
literal_string
	: STRING
		{$$ = string($1);}
	;
