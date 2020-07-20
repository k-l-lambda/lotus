
dotB = \markup { \char ##x25cf }
dotW = \markup { \char ##x25cb }

lyrRed = { \override Lyrics.LyricText.color = #red \override Lyrics.LyricText.font-series = #'bold }
lyrGreen = { \override Lyrics.LyricText.color = #darkgreen \override Lyrics.LyricText.font-series = #'bold }
lyrYellow = { \override Lyrics.LyricText.color = #(rgb-color 0.8 0.7 0) \override Lyrics.LyricText.font-series = #'bold }
lyrGray = { \override Lyrics.LyricText.color = #(rgb-color 0.6 0.6 0.6) \revert Lyrics.LyricText.font-series }
