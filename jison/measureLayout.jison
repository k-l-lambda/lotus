
%{
	const root = (type, data) => ({proto: "MesaureLayout", type, data});

	const singleLayout = measure => ({proto: "SingleMLayout", measure});
	const blockLayout = seq => ({proto: "BlockMLayout", seq});
%}


%lex

%option flex unicode

A					[a-z]
N					[0-9]
UNSIGNED			{N}+
WORD				{A}+

SPECIAL				[*,\[\]<>{}]


%%

\s+									{}	// spaces

{SPECIAL}							return yytext;

{UNSIGNED}							return 'UNSIGNED'
{WORD}":"							return yytext

<<EOF>>								return 'EOF';


/lex

%start start_symbol

%%

start_symbol
	: measure_layout EOF
		{
			return $1;
		}
	;

measure_layout
	: 'i:' index_wise_measure_layout
		{$$ = root("index-wise", $2);}
	| 's:' segment_wise_measure_layout
		{$$ = root("segment-wise", $2);}
	;

index_wise_measure_layout
	: sequence
		{
			if ($1.length === 1 && $1.proto === "BlockMLayout")
				$$ = $1;
			else
				$$ = blockLayout($1);
		}
	;

segment_wise_measure_layout
	: %empty
		{$$ = null;}
	;

sequence
	: layout_item
		{$$ = [$1];}
	| sequence ',' layout_item
		{$$ = [...$1, $3];}
	;

layout_item
	: single_layout
		{$$ = $1;}
	;

single_layout
	: UNSIGNED
		{$$ = singleLayout($1);}
	;
