
%{
	const root = (type, data) => ({proto: "MesaureLayout", type, data});

	const singleLayout = measure => ({proto: "SingleMLayout", measure});
	const blockLayout = seq => ({proto: "BlockMLayout", seq});
	const voltaBlock = (times, body, alternates) => ({proto: "VoltaMLayout", times, body, alternates});

	const segment = n => ({segment: true, length: Number(n)});


	const serializeSeq = (item, options) => {
		if (item.segment) {
			const index = options.index;
			options.index += item.length;

			return Array(item.length).fill(0).map((_, i) => singleLayout(index + i));
		}

		return [serialize(item, options)];
	};

	const serialize = (item, options = {index: 1}) => {
		const speard = seq => [].concat(...seq.map(it => serializeSeq(it, options)));

		switch (item.proto) {
		case "BlockMLayout":
			item.seq = speard(item.seq);

			break;
		case "VoltaMLayout":
			item.body = speard(item.body);
			item.alternates = item.alternates.map(speard);

			break;
		}

		return item;
	};
%}


%lex

%option flex unicode

A					[a-z]
N					[1-9]
N0					[0-9]
UNSIGNED			{N}{N0}*
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
		{$$ = root("segment-wise", serialize($2));}
	;


index_wise_measure_layout
	: iw_sequence
		{
			if ($1.length === 1 && $1[0].proto === "BlockMLayout")
				$$ = $1[0];
			else
				$$ = blockLayout($1);
		}
	;

iw_sequence
	: iw_item
		{$$ = [$1];}
	| iw_sequence ',' iw_item
		{$$ = [...$1, $3];}
	;

iw_item
	: single
		{$$ = $1;}
	| iw_block_item
		{$$ = $1;}
	| iw_volta
		{$$ = $1;}
	;

single
	: UNSIGNED
		{$$ = singleLayout($1);}
	;

iw_block_item
	: iw_block
		{$$ = blockLayout($1);}
	;

iw_block
	: '[' iw_sequence ']'
		{$$ = $2;}
	;

iw_volta
	: UNSIGNED '*' iw_block iw_optional_alternates
		{$$ = voltaBlock($1, $3, $4);}
	;

iw_optional_alternates
	: %empty
		{$$ = []}
	;


segment_wise_measure_layout
	: sw_sequence
		{
			if ($1.length === 1 && $1[0].proto === "BlockMLayout")
				$$ = $1[0];
			else
				$$ = blockLayout($1);
		}
	;

sw_sequence
	: sw_item
		{$$ = [$1];}
	| sw_sequence sw_item
		{$$ = [...$1, $2];}
	;

sw_item
	: segement
		{$$ = $1;}
	| sw_block_item
		{$$ = $1;}
	| sw_volta
		{$$ = $1;}
	;

segement
	: UNSIGNED
		{$$ = segment($1);}
	;

sw_block_item
	: sw_block
		{$$ = blockLayout($1);}
	;

sw_block
	: '[' sw_sequence ']'
		{$$ = $2;}
	;

sw_volta
	: UNSIGNED '*' sw_block sw_optional_alternates
		{$$ = voltaBlock($1, $3, $4);}
	;

sw_optional_alternates
	: %empty
		{$$ = []}
	;
