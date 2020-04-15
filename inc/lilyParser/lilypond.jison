
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
{SPECIAL}					return 'SPECIAL';
\|							return 'DIVIDE';

<<EOF>>						return 'EOF';


/lex


%%

expressions
	: expressions EOF
		{ return $1; }
	| expressions word
		{$$ = $1.concat([$2]);}
	| word
		{$$ = [$1];}
	;

word
	: NOTE
		{$$ = $1;}
	| COMMAND
		{$$ = $1;}
	| SYMBOL
		{$$ = $1;}
	| SPECIAL
		{$$ = $1;}
	| DIVIDE
		{$$ = $1;}
	| FRACTION
		{$$ = $1;}
	| STRING
		{$$ = $1;}
	;
