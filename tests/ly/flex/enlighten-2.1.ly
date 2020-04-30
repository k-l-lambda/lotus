\version "2.20.0"
% automatically converted by musicxml2ly from ./temp/xml2ly-wMDY1NTY2Mj.xml

\header {
    encodingdate =  "2017-10-20"
    encodingdescription =  "Sibelius / MusicXML 3.0"
    encoder =  star
    encodingsoftware =  "Sibelius 8.1.1"
    }

#(set-global-staff-size 28.5714285714)
\paper {
    
    paper-width = 21.0\cm
    paper-height = 29.7\cm
    top-margin = 1.5\cm
    bottom-margin = 1.5\cm
    left-margin = 1.5\cm
    right-margin = 1.5\cm
    between-system-space = 2.3\cm
    indent = 1.61538461538\cm
    }
\layout {
    \context { \Score
        autoBeaming = ##f
        }
    }
PartPOneVoiceOne =  \relative d' {
    \clef "treble" \key c \major \time 4/4 \omit Staff.TimeSignature
    | % 1
    \stemUp d2 -\markup{ \bold\tiny {2} } \stemUp d2 | % 2
    \stemUp d2 \stemUp d4 \stemUp d4 | % 3
    \stemUp d4 \stemUp d4 \stemUp d4 \stemUp d4 | % 4
    \stemUp d2 \stemUp d2 \bar "|."
    }


% The score definition
\score {
    <<
        
        \new Staff
        <<
            %\set Staff.instrumentName = "P1"
            
            \context Staff << 
                \mergeDifferentlyDottedOn\mergeDifferentlyHeadedOn
                \context Voice = "PartPOneVoiceOne" {  \PartPOneVoiceOne }
                >>
            >>
        
        >>
    \layout {}
    % To create MIDI output, uncomment the following line:
    \midi {\tempo 4 = 100 }
    }

naturalWidth = 0.4371290093554699 

naturalHeight = 0.03953922790305174 
