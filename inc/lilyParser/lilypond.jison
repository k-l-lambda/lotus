
%lex

%%
\s+					{}
\"[^"]*\"			return 'STRING';
\w+					return 'IDENTIFIER';
\/\/[^\n]*			{}
\%\{(.|\n)*?\%\}	{}
\%[^\n]*\n			{}
<<EOF>>				return 'EOF';


/lex


%%

expressions
	: parts EOF
		{ return $1; }
	;

parts
	: parts exp
		{$$ = $1.concat([$2]);}
	| exp
		{$$ = [$1];}
	;

exp
	: IDENTIFIER
		{$$ = $1;}
	| STRING
		{$$ = $1;}
	;
