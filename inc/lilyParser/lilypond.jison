
%{
	const command = (cmd, arg) => ({cmd, arg});

	const chord = (pitches, duration) => ({pitches, duration: duration && Number(duration)});
%}


%lex

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

PHONET				[abcdefgr]
PITCH				{PHONET}(([i][s])*|([e][s])*)(?=[\W\d])
//PITCH				{TONE}(\'*|\,*)
//DURATION			"1"|"2"|"4"|"8"|"16"|"32"|"64"|"128"|"256"


%%

// workaround non-word-boundary parsing for POST_UNSIGNED
\s{FRACTION}				yytext = yytext.replace(/^\s+/, ""); return 'FRACTION';
\s{REAL}					yytext = yytext.replace(/^\s+/, ""); return 'REAL';
\s{UNSIGNED}				yytext = yytext.replace(/^\s+/, ""); return 'UNSIGNED';

\s+							{}	// spaces
\%\{(.|\n)*?\%\}			{}	// scoped comments
\%[^\n]*\n					{}	// single comments
\"(\\\"|[^"])*\"			return 'STRING';

{EXTENDER}					return 'EXTENDER';
{HYPHEN}					return 'HYPHEN';

"<"							return 'ANGLE_OPEN';
">"							return 'ANGLE_CLOSE';

{E_UNSIGNED}				return 'E_UNSIGNED';

// binary commands

// unitary commands
"\\clef"					return 'CMD_CLEF';
"\\key"						return 'CMD_KEY';
"\\time"					return 'CMD_TIME';
"\\times"					return 'CMD_TIMES';
"\\stemUp"					return 'CMD_STEMUP';
"\\stemDown"				return 'CMD_STEMDOWN';
"\\relative"				return 'CMD_RELATIVE';
"\\bar"						return 'CMD_BAR';

"\\version"					return 'CMD_VERSION';
"\\column"					return 'CMD_COLUMN';
"\\line"					return 'CMD_LINE';

// simple commands

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

"\\cm"						return 'CENTIMETER';

{COMMAND}					return 'COMMAND';

{PITCH}						return 'PITCH';
{UNSIGNED}					return 'POST_UNSIGNED';

{INT}						return 'INT';

{SYMBOL}					return 'SYMBOL';

{SPECIAL}					return yytext;
\|							return 'DIVIDE';

[()]						return yytext;

"["							return yytext;
"]"							return yytext;

"##f"						return 'SCM_FALSE';

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
		{$$ = [];}
	| version
		{$$ = [$1];}
	| lilypond toplevel_expression
		{$$ = $1.concat([$2]);}
	| lilypond assignment
		{$$ = $1.concat([$2]);}
	;

version
	: CMD_VERSION STRING
		{$$ = {version: $2};}
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
	//| full_markup_list
	//	{$$ = $1;}
	//| book_block
	//| bookpart_block
	//| BOOK_IDENTIFIER
	//| score_block
	//| SCM_TOKEN
	//| embedded_scm_active
	;

header_block
	: lilypond_header
		{$$ = $1;}
	;

lilypond_header
	: HEADER '{' lilypond_header_body '}'
		{$$ = {type: "header", data: $3};}
	;

lilypond_header_body
	: %empty
		{$$ = [];}
	| lilypond_header_body assignment
		{$$.push($2);}
	;

assignment
	: assignment_id '=' identifier_init
		{$$ = {key: $1, value: $3};}
	| assignment_id '.' property_path '=' identifier_init
		{$$ = {key: $1 + $3, value: $5};}
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
	//| symbol_list_rev '.' symbol_list_partf
	| symbol_list_rev ',' symbol_list_part
		{$$ = $1 + "," + $3;}
	;

symbol_list_part
	: symbol_list_part_bare
		{$$ = $1;}
	| embedded_scm_bare
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
	| STRING
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
	//| score_block
	//| book_block
	//| bookpart_block
	//| output_def
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

full_markup_list
	: MARKUPLIST
		{$$ = $1;}
	| markup_list
		{$$ = $1;}
	;

markup_list
	: markup_composed_list
	| markup_uncomposed_list
		{$$ = $1;}
	;

markup_composed_list
	: markup_head_1_list markup_uncomposed_list
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
		{$$ = {number: Number($1), unit: $2};}
	| INT number_unit
		{$$ = {number: Number($1), unit: $2};}
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
	//: embedded_scm
	: music
	//| output_def
	;

//markup_command_list
//	: MARKUP_LIST_FUNCTION markup_command_list_arguments
//	;

markup_scm
	: embedded_scm
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
	| LOOKUP_IDENTIFIER '.' symbol_list_rev
	;

symbol_list_rev
	: symbol_list_part
	| symbol_list_rev '.' symbol_list_part
	| symbol_list_rev ',' symbol_list_part
	;

symbol_list_part
	: symbol_list_part_bare
	| embedded_scm_bare
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
	;

composite_music
	: basic_music
		{$$ = $1;}
	//| contexted_basic_music
	//| basic_music new_lyrics
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
	//| mode_changed_music
	//	{$$ = $1;}
	;

grouped_music_list
	: sequential_music
		{$$ = $1;}
	//\ simultaneous_music
	;

sequential_music
	: braced_music_list
		{$$ = $1;}
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
	//| music_property_def
	//| context_change
	;

event_chord
	: note_chord_element
		{$$ = $1;}
	//| simple_element post_events
	//| CHORD_REPETITION optional_notemode_duration post_events
	//| MULTI_MEASURE_REST optional_notemode_duration post_events
	//| tempo_event
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
	: POST_UNSIGNED dots
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
	| multipliers '*' UNSIGNED
		{$$ = $1 + "*" + $3;}
	//| multipliers '*' FRACTION
	;

repeated_music
	: REPEAT simple_string unsigned_number music
		{$$ = {repeat: [$2, $3], music: $4};}
	;

unsigned_number
	: UNSIGNED
		{$$ = $1;}
	;

simple_string
	: STRING
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	;

// all kinds commands in music list, seems named as MUSIC_IDENTIFIER in lilypond's parser.yy
music_identifier
	: COMMAND
		{$$ = command($1);}
	| unitary_cmd value
		{$$ = command($1, $2);}
	//| binary_cmd value value
	//	{$$ = command($1, [$2, $3]);}
	| "("
		{$$ = $1;}
	| ")"
		{$$ = $1;}
	| "["
		{$$ = $1;}
	| "]"
		{$$ = $1;}
	| DIVIDE
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
	| CMD_RELATIVE
		{$$ = $1;}
	| CMD_BAR
		{$$ = $1;}
	;

value
	: music
		{$$ = $1;}
	| FRACTION
		{$$ = $1;}
	| INT
		{$$ = $1;}
	| REAL
		{$$ = $1;}
	| STRING
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	;

pitch_or_music
	//: pitch exclamations questions octave_check maybe_notemode_duration erroneous_quotes optional_rest post_events
	: pitch optional_notemode_duration
		{$$ = chord([$1], $2);}
	//| new_chord post_events
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
	;

post_event_nofinger
	: '^' fingering
		{$$ = {type: "fingering", direction: "up", value: $2};}
	| '_' fingering
		{$$ = {type: "fingering", direction: "down", value: $2};}
	| direction_less_event
		{$$ = $1;}
	| script_dir music_function_call
	| HYPHEN
	| EXTENDER
	| script_dir direction_reqd_event
	| script_dir direction_less_event
	;

direction_reqd_event
	: gen_text_def
	| script_abbreviation
	;

gen_text_def
	: full_markup
	| STRING
	| SYMBOL
	| embedded_scm
	;

script_abbreviation
	: '^'
	| '+'
	| '-' 
 	| '!'
	| ANGLE_CLOSE
	| '.' 
	| '_'
	;

direction_less_event
	: string_number_event
	//| EVENT_IDENTIFIER
	| tremolo_type
	| event_function_event
	;

string_number_event
	: E_UNSIGNED
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
	| "^"
	| "-"
	;

fingering
	: POST_UNSIGNED
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
		{$$ = {head: $1};}
	| output_def_body assignment
	//| output_def_body embedded_scm_active
	//| output_def_body SCM_TOKEN
	| output_def_body music_or_context_def
	//| output_def_body error
	;

output_def_head_with_mode_switch
	: output_def_head
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
	| context_def_spec_block
	;

context_def_spec_block
	: CONTEXT '{' context_def_spec_body '}'
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
	| composite_music
	;

context_modification
	: WITH '{' context_mod_list '}'
	| WITH context_modification_arg
	;

context_mod
	: property_operation
	| context_def_mod SYMBOL
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