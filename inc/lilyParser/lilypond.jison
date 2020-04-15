
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
TONE				{PHONET}(([i][s])*|([e][s])*)
PITCH				{TONE}(\'*|\,*)
NOTE				{PITCH}{UNSIGNED}?


%%

\s+							{}	// spaces
\%\{(.|\n)*?\%\}			{}	// scoped comments
\%[^\n]*\n					{}	// single comments
\"(\\\"|[^"])*\"			return 'STRING';

{NOTE}						return 'NOTE';

{COMMAND}					return 'COMMAND';
{SYMBOL}					return 'SYMBOL';
{FRACTION}					return 'FRACTION';
{INT}						return 'INT';
{REAL}						return 'REAL';

{SPECIAL}					return yytext;
\|							return 'DIVIDE';

<<EOF>>						return 'EOF';


/lex


%%

expressions
	: expressions EOF
		{ return $1; }
	| paragraphs
		{$$ = $1;}
	| %empty
		{$$ = null;}
	;

paragraphs
	: paragraph
		{$$ = [$1];}
	| paragraphs paragraph
		{$$ = $1.concat([$2]);}
	;

paragraph
	: /*declaration
		{$$ = $1;}
	|*/ block
		{$$ = $1;}
	;

block
	: brackets_scope
		{$$ = {chidren: $1};}
	| cmd brackets_scope
		{$$ = {head: $1, chidren: $2};}
	;

cmd
	: COMMAND arguments
		{$$ = {cmd: $1, args: $2}}
	;

arguments
	: %empty
		{$$ = [];}
	| argument
		{$$ = [$1];}
	| arguments argument
		{$$ = $1.concat([$2]);}
	;

argument
	: note
		{$$ = $1;}
	| FRACTION
		{$$ = $1;}
	| INT
		{$$ = $1;}
	| REAL
		{$$ = $1;}
	| STRING
		{$$ = $1;}
	;

brackets_scope
	: "{" statements "}"
		{$$ = $2;}
	;

statements
	: %empty
		{$$ = [];}
	| statement
		{$$ = [$1];}
	| statements statement
		{$$ = $1.concat([$2]);}
	;

statement
	: cmd
		{$$ = $1;}
	| note
		{$$ = $1;}
	| DIVIDE
		{$$ = $1;}
	;

word
	: note
		{$$ = $1;}
	| COMMAND
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| DIVIDE
		{$$ = $1;}
	| FRACTION
		{$$ = $1;}
	| STRING
		{$$ = $1;}
	;

note
	: NOTE
		{$$ = $1;}	// TODO
	;
