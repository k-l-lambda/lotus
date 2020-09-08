\header {
 copyright = \markup {
     \override #'(font-name . "DejaVu Sans, Bold") 
     \override #'(baseline-skip . 0) 
     \right-column {
         \with-url "http://www.MutopiaProject.org" {
             \abs-fontsize #9  "Mutopia "
             \concat {
                 \abs-fontsize #12 \with-color #white \char ##x01C0 \abs-fontsize #9 "Project "
              }
          }
      }
      \override #'(font-name . "DejaVu Sans, Bold") 
      \override #'(baseline-skip . 0 ) 
      \center-column {
          \abs-fontsize #11.9 \with-color #grey \bold {
              \char ##x01C0 \char ##x01C0 
          }
      }
      \override #'(font-name . "DejaVu Sans,sans-serif") 
      \override #'(baseline-skip . 0) 
      \column { 
          \abs-fontsize #8 \concat {
              "Typeset using " \with-url "http://www.lilypond.org" "LilyPond " \char ##x00A9 " 2017 " "by " \maintainer " " \char ##x2014 " " \footer
          }
          \concat {
              \concat {
                  \abs-fontsize #8 { 
                      \with-url "http://creativecommons.org/licenses/by-sa/4.0/" "Creative Commons Attribution ShareAlike 4.0 International License "
                      \char ##x2014 " free to distribute, modify, and perform" 
                  }
              }
              \abs-fontsize #13 \with-color #white \char ##x01C0 
          }
      }
  }
}
