
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
EXTENDER			__
HYPHEN				--
BOM_UTF8			\357\273\277

PHONET				[abcdefgr]
PITCH				{PHONET}(([i][s])*|([e][s])*)
//PITCH				{TONE}(\'*|\,*)
//DURATION			"1"|"2"|"4"|"8"|"16"|"32"|"64"|"128"|"256"


%%

// workaround non-word-boundary parsing for POST_UNSIGNED
\s{FRACTION}				yytext = yytext.replace(/^\s+/, ""); return 'FRACTION';
\s{UNSIGNED}				yytext = yytext.replace(/^\s+/, ""); return 'UNSIGNED';
\s{REAL}					yytext = yytext.replace(/^\s+/, ""); return 'REAL';

\s+							{}	// spaces
\%\{(.|\n)*?\%\}			{}	// scoped comments
\%[^\n]*\n					{}	// single comments
\"(\\\"|[^"])*\"			return 'STRING';

// binary command
"\\repeat"					return 'CMD_REPEAT';

// unitary command
"\\clef"					return 'CMD_CLEF';
"\\key"						return 'CMD_KEY';
"\\time"					return 'CMD_TIME';
"\\stemUp"					return 'CMD_STEMUP';
"\\stemDown"				return 'CMD_STEMDOWN';
"\\relative"				return 'CMD_RELATIVE';
"\\bar"						return 'CMD_BAR';
"\\version"					return 'CMD_VERSION';

// simple command
"\\header"					return 'CMD_HEADER';

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
	;

header_block
	: CMD_HEADER '{' lilypond_header_body '}'
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
	//| embedded_scm_bare
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
	//| number_expression
	;

identifier_init_nonumber
	: header_block
		{$$ = $1;}
	| composite_music
		{$$ = $1;}
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
	: CMD_REPEAT simple_string unsigned_number music
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
	: CMD_REPEAT
		{$$ = $1;}
	;*/

unitary_cmd
	: CMD_CLEF
		{$$ = $1;}
	| CMD_KEY
		{$$ = $1;}
	| CMD_TIME
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
	;

fingering
	: POST_UNSIGNED
		{$$ = $1;}
	;
