
%{

}%


%lex

%option flex unicode

%%


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
	: %empty
		{}
	;
