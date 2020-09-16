
% \lotusRepeatABA { {A} B }
%		->
%		{A} B {A}
lotusRepeatABA = #(define-music-function (music)
	(ly:music?)
	"The placeholder function to represent a music repeat type AB -> ABA,
		e.g. Da Carpo al Fine, Da Segno al Coda and so on.
	"
	music
)
