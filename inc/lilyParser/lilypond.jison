
%{
	const root = (sections = []) => ({proto: "Root", sections});

	const appendSection = (list, item) => {
		list.sections.push(item);

		return list;
	};

	const command = (cmd, ...args) => ({proto: "Command", cmd: cmd.substr(1), args});

	const chord = (pitches, duration) => ({proto: "Chord", pitches, duration});

	const block = (block, head, body, mods) => ({proto: "Block", block, head, body, mods});

	const scheme = exp => ({proto: "Scheme", exp});

	const schemeExpression = (func, args) => ({proto: "SchemeExpression", func, args});

	const assignment = (key, value) => ({proto: "Assignment", key, value});

	const numberUnit = (number, unit) => ({proto: "NumberUnit", number: Number(number), unit});
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
INT					[-]?{UNSIGNED}
REAL				({INT}\.{N}*)|([-]?\.{N}+)
STRICTREAL			{UNSIGNED}\.{UNSIGNED}
WHITE				[ \n\t\f\r]
HORIZONTALWHITE		[ \t]
BLACK				[^ \n\t\f\r]
RESTNAME			[rs]
ESCAPED				[nt\\''""]
EXTENDER			\_\_
HYPHEN				\-\-
BOM_UTF8			\357\273\277

PHONET				[abcdefgrR]
PITCH				{PHONET}(([i][s])*|([e][s])*|[s]*)(?=[\W\d])
PLACEHOLDER_PITCH	[s](?=[\W\d])
//DURATION			"1"|"2"|"4"|"8"|"16"|"32"|"64"|"128"|"256"

//UNICODE_HAN			[\p{Script=Han}]

%%

// workaround non-word-boundary parsing for POST_UNSIGNED
//\s{FRACTION}				yytext = yytext.replace(/^\s+/, ""); return 'FRACTION';
\s{REAL}					yytext = yytext.replace(/^\s+/, ""); return 'REAL';
//\s{UNSIGNED}				yytext = yytext.replace(/^\s+/, ""); return 'UNSIGNED';

\s+							{}	// spaces
\%\{(.|\n)*?\%\}			{}	// scoped comments
\%[^\n]*\n					{}	// single comments
\"(\\\"|[^"])*\"			return 'STRING';

{EXTENDER}					return 'EXTENDER';
{HYPHEN}					return 'HYPHEN';

//"<"							return 'ANGLE_OPEN';
//">"							return 'ANGLE_CLOSE';
"<<"						return 'DOUBLE_ANGLE_OPEN';
">>"						return 'DOUBLE_ANGLE_CLOSE';

{E_UNSIGNED}				return 'E_UNSIGNED';

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
//"\\Score"					return 'SCORE';		// why there is capital score in layout/context block?
"\\score-lines"				return 'SCORELINES';
"\\sequential"				return 'SEQUENTIAL';
"\\set"						return 'SET';
"\\simultaneous"			return 'SIMULTANEOUS';
"\\tempo"					return 'TEMPO';
"\\type"					return 'TYPE';
"\\unset"					return 'UNSET';
"\\with"					return 'WITH';

"\\new"						return 'NEWCONTEXT';

"\\cm"						return 'CENTIMETER';

// binary commands
"\\relative"				return 'CMD_RELATIVE';

// unitary commands
"\\clef"					return 'CMD_CLEF';
"\\key"						return 'CMD_KEY';
"\\time"					return 'CMD_TIME';
"\\times"					return 'CMD_TIMES';
"\\stemUp"					return 'CMD_STEMUP';
"\\stemDown"				return 'CMD_STEMDOWN';
"\\bar"						return 'CMD_BAR';
"\\omit"					return 'CMD_OMIT';
"\\ottava"					return 'CMD_OTTAVA';
"\\barNumberCheck"			return 'CMD_BARNUMBERCHECK';
"\\partial"					return 'CMD_PARTIAL';
"\\mark"					return 'CMD_MARK';

"\\version"					return 'CMD_VERSION';
"\\column"					return 'CMD_COLUMN';
"\\line"					return 'CMD_LINE';
"\\bold"					return 'CMD_BOLD';
"\\italic"					return 'CMD_ITALIC';
"\\box"						return 'CMD_BOX';

"\\huge"					return 'CMD_HUGE';
"\\large"					return 'CMD_LARGE';
"\\normalsize"				return 'CMD_NORMALSIZE';
"\\small"					return 'CMD_SMALL';
"\\tiny"					return 'CMD_TINY';
"\\teeny"					return 'CMD_TEENY';

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

{INT}						return 'INT';

{SYMBOL}					return 'SYMBOL';

"##f"						return 'SCM_FALSE';
"##t"						return 'SCM_TRUE';
\#{INT}						return 'SCM_INT';

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
	: CMD_VERSION STRING
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
	| embedded_scheme_expression
		{$$ = $1;}
	//| full_markup_list
	//	{$$ = $1;}
	//| book_block
	//| bookpart_block
	//| BOOK_IDENTIFIER
	//| SCM_TOKEN
	//| embedded_scm_active
	;

score_block
	: SCORE '{' score_body '}'
		{$$ = block("score", $1, $3);}
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
	;

assignment
	: assignment_id '=' identifier_init
		{$$ = assignment($1, $3);}
	| assignment_id '.' property_path '=' identifier_init
		{$$ = assignment($1 + $3, $5);}
	//| markup_mode_word '=' identifier_init
	;

assignment_id
	: STRING
		{$$ = $1;}
	| SYMBOL
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
	: STRING
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
	| full_markup_list
		{$$ = $1;}
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
	//| book_block
	//| bookpart_block
	//| context_def_spec_block
	//| partial_markup
	//| context_modification
	//| partial_function ETC
	;

string
	: STRING
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| full_markup
		{$$ = $1;}
	;

text
	: STRING
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
		{$$ = $1;}
	;

markup_composed_list
	: markup_head_1_list markup_uncomposed_list
		{$$ = block("markup", $1, $2);}
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
		{$$ = {func: $1};}
	;

// equivalent for MARKUP_FUNCTION in lilypond's parser.yy
markup_function
	: CMD_COLUMN
		{$$ = $1;}
	| CMD_LINE
		{$$ = $1;}
	| CMD_BOLD
		{$$ = $1;}
	| CMD_ITALIC
		{$$ = $1;}
	| markup_font_size
		{$$ = $1;}
	| CMD_BOX
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
		{$$ = $2;}
	;

markup_braced_list_body
	: %empty
		{$$ = [];}
	| markup_braced_list_body markup
		{$$ = $1.concat([$2]);}
	| markup_braced_list_body markup_list
		{$$ = $1.concat([$2]);}
	;

markup
	: markup_head_1_list simple_markup
		{$$ = {head: $1, data: $2};}
	| simple_markup
		{$$ = {data: $1};}
	;

simple_markup
	: markup_word
		{$$ = $1;}
	| simple_markup_noword
		{$$ = $1;}
	;

markup_word
	: STRING
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	// extra formla
	| "."
		{$$ = $1;}
	// extra formla
	| "-"
		{$$ = $1;}
	// extra formla
	| "'"
		{$$ = $1;}
	| unsigned_number
		{$$ = $1;}
	// extra formla
	| UNKNOWN_CHAR
		{$$ = $1;}
	;

simple_markup_noword
	: SCORE '{' score_body '}'
		{$$ = {score: $3};}
	| markup_function markup_command_basic_arguments
		{$$ = {func: $1, args: $2};}
	//| markup_scm MARKUP_IDENTIFIER
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
	//| EXPECT_SCM markup_command_list_arguments STRING
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
	;

// equivalent for NUMBER_IDENTIFIER in lilypond's parser.yy
number_identifier
	: REAL number_unit
		{$$ = numberUnit($1, $2);}
	| INT number_unit
		{$$ = numberUnit($1, $2);}
	;

// addon term to construct number_identifier
number_unit
	: CENTIMETER
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
	: SCM_FALSE
		{$$ = false;}
	| SCM_TRUE
		{$$ = true;}
	| SCM_INT
		{$$ = $1;}
	| "#" "'" SYMBOL
		{$$ = {scm_id: $3};}
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
		{$$ = {head: $1, body: $2, lyrics: $3}}
	| context_prefix contextable_music
		{$$ = {head: $1, body: $2}}
	| context_prefix contexted_basic_music
		{$$ = {head: $1, body: $2}}
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
		{$$ = {context: $2, assign: $3, mods: $4};}
	| NEWCONTEXT symbol optional_id optional_context_mods
		{$$ = {context: $2, new: true, assign: $3, mods: $4};}
	;

optional_id
	: %empty
		{$$ = null;}
	| '=' simple_string
		{$$ = $2;}
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
		{$$ = {head: $1, body: $2};}
	| mode_changing_head_with_context optional_context_mods grouped_music_list
		{$$ = {head: $1, mods: $2, body: $3};}
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
	| CHORDMODE
		{$$ = $1;}
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
		{$$ = {music: "simultaneous", body: $2};}
	| DOUBLE_ANGLE_OPEN music_list DOUBLE_ANGLE_CLOSE
		{$$ = {music: "simultaneous", body: $2};}
	;

sequential_music
	: braced_music_list
		{$$ = {music: "sequential", body: $1};}
	;

braced_music_list
	: '{' music_list '}'
		{$$ = $2;}
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
	;

music
	: music_assign
		{$$ = $1;}
	| pitch_as_music
		{$$ = $1;}
	//| lyric_element_music
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
		{$$ = {change: $2, value: $4};}
	;

music_property_def
	: OVERRIDE grob_prop_path '=' scalar
		{$$ = command($1, assignment($2, $4));}
	| REVERT simple_revert_context revert_arg
		{$$ = command($1, $2, $3);}
	| SET context_prop_spec '=' scalar
		{$$ = command($1, assignment($2, $4));}
	| UNSET context_prop_spec
		{$$ = command($1, $2);}
	;

revert_arg
	: revert_arg_backup BACKUP symbol_list_arg
	;

simple_revert_context
	: symbol_list_part
		{$$ = $1;}
	;

grob_prop_path
	: grob_prop_spec
		{$$ = $1;}
	| grob_prop_spec property_path
		{$$ = $1 + $2;}
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
		{$$ = {tempo: $4, unit: $2};}
	| TEMPO text steno_duration '=' tempo_range
		{$$ = {tempo: $5, unit: $3, text: $2};}
	| TEMPO text
		{$$ = {tempo: $2};}
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
		{$$ = $1 + $2;}
	;

steno_duration
	: unsigned_number dots
		{$$ = $1 + $2;}
	;

dots
	: %empty
		{$$ = "";}
	| dots "."
		{$$ = $1 + $2;}
	;

multipliers
	: %empty
		{$$ = "";}
	| multipliers '*' unsigned_number
		{$$ = $1 + "*" + $3;}
	| multipliers '*' FRACTION
		{$$ = $1 + "*" + $3;}
	//| multipliers '*' multiplier_scm
	;

repeated_music
	: REPEAT simple_string unsigned_number music
		{$$ = {repeat: [$2, $3], music: $4};}
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
	: STRING
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
	//| binary_cmd value value
	//	{$$ = command($1, [$2, $3]);}
	| cmd_relative
		{$$ = $1;}
	| "("
		{$$ = $1;}
	| ")"
		{$$ = $1;}
	| "["
		{$$ = $1;}
	| "]"
		{$$ = $1;}
	| "~"
		{$$ = $1;}
	| DIVIDE
		{$$ = $1;}
	| expressive_mark
		{$$ = $1;}
	;

// extra syntax
zero_command
	: COMMAND
		{$$ = command($1);}
	;

expressive_mark
	: CMD_CRESCENDO_BEGIN
		{$$ = $1;}
	| CMD_DECRESCENDO_BEGIN
		{$$ = $1;}
	| CMD_DYNAMICS_END
		{$$ = $1;}
	;

/*binary_cmd
	;*/

unitary_cmd
	: CMD_CLEF
		{$$ = $1;}
	| CMD_KEY
		{$$ = $1;}
	| CMD_TIME
		{$$ = $1;}
	| CMD_TIMES
		{$$ = $1;}
	| CMD_STEMUP
		{$$ = $1;}
	| CMD_STEMDOWN
		{$$ = $1;}
	//| CMD_RELATIVE
	//	{$$ = $1;}
	| CMD_BAR
		{$$ = $1;}
	| CMD_OMIT
		{$$ = $1;}
	| CMD_OTTAVA
		{$$ = $1;}
	| CMD_BARNUMBERCHECK
		{$$ = $1;}
	| CMD_PARTIAL
		{$$ = $1;}
	| CMD_MARK
		{$$ = $1;}
	;

// extra syntax
cmd_relative
	: CMD_RELATIVE pitch music
		{$$ = {relative: $2, music: $3};}
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
	| INT
		{$$ = $1;}
	| REAL
		{$$ = $1;}
	| STRING
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
		{$$ = chord([$1], $4);}
	//| new_chord post_events
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
	: "<" pitches ">" optional_notemode_duration
		{$$ = chord($2, $4);}
	;

pitches
	:	pitches pitch
		{$$ = $1.concat([$2]);}
	|	pitch
		{$$ = [$1];}
	;

pitch
	: PITCH quotes
		{$$ = $1 + $2;}
	//| steno_pitch
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
		{$$ = {type: "fingering", direction: "middle", value: $2};}
	;

post_event_nofinger
	: '^' fingering
		{$$ = {direction: "up", fingering: $2};}
	| '_' fingering
		{$$ = {direction: "down", fingering: $2};}
	| direction_less_event
		{$$ = $1;}
	| script_dir music_function_call
		{$$ = {direction: $1, event: $2};}
	| HYPHEN
		{$$ = $1;}
	| EXTENDER
		{$$ = $1;}
	| script_dir direction_reqd_event
		{$$ = {direction: $1, event: $2};}
	| script_dir direction_less_event
		{$$ = {direction: $1, event: $2};}
	// extra formula
	| script_dir zero_command
		{$$ = {direction: $1, cmd: $2};}
	| script_dir expressive_mark
		{$$ = {direction: $1, expressive: $2};}
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
	| STRING
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
	| '.' 
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
	| ':' UNSIGNED
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
		{$$ = {markup: $2};}
	| markup_mode_word
		{$$ = $1;}
	;

markup_mode
	: MARKUP
		{$$ = $1;}
	;

markup_top
	: markup_list
		{$$ = {body: $1};}
	| markup_head_1_list simple_markup
		{$$ = {head: $1, body: $2};}
	| simple_markup_noword
		{$$ = {body: $1};}
	;

markup_mode_word
	: markup_mode markup_word
		{$$ = {markup: $2};}
	;

output_def
	: output_def_body '}'
		{$$ = $1;}
	;

output_def_body
	: output_def_head_with_mode_switch '{'
		{$$ = block("score", $1, []);}
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
		{$$ = {with: $3};}
	| WITH context_modification_arg
		{$$ = {with: $3};}
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
	| context_def_mod SYMBOL
		{$$ = {mod: $1, value: $2};}
	//| context_def_mod embedded_scm
	;

property_operation
	: symbol '=' scalar
	| UNSET symbol
	| OVERRIDE revert_arg '=' scalar
	| REVERT revert_arg
	;

symbol
	: STRING
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
		{$$ = $1 + "." + $3;}
	;

bare_number
	: bare_number_common
		{$$ = $1;}
	| UNSIGNED
		{$$ = $1;}
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


// extra syntax, maybe the substitution for embedded_scm_active in lilypond's parser
embedded_scheme_expression
	: "#" scheme_expression
		{$$ = scheme($2);}
	;

scheme_expression
	: "(" scheme_token scheme_args ")"
		{$$ = schemeExpression($2, $3);}
	| scheme_token
		{$$ = $1;}
	;

scheme_args
	: %empty
		{$$ = [];}
	| scheme_args scheme_token
		{$$ = $1.concat($2);}
	;

scheme_token
	: bare_number
		{$$ = $1;}
	| symbol
		{$$ = $1;}
	;

optional_rest
	: %empty
		{$$ = null;}
	| REST
		{$$ = $1;}
	;
