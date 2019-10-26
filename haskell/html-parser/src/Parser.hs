module Parser where

import           Data.List                      ( foldl' )
import           Control.Monad                  ( foldM )
import           Data.Char                      ( isSpace )

{- #####################################################################
 - Pre-process Steps
 -}

type Position = (Int, Int)
data CharInfo = CharInfo {
  char::Char,
  position:: Position,
  line::String
} deriving (Show)
type PString = [CharInfo]

toCharInfo :: String -> PString
toCharInfo input =
  let textLines = zip (lines input) [1 ..]
      withRow :: (String, Int) -> PString
      withRow (line, row) = fmap (info line row) (lineCols line)
      lineCols line = take (length line) [1 ..]
      info line row col = CharInfo (line !! (col - 1)) (row, col) line
  in  textLines >>= withRow

isOpening :: CharInfo -> Bool
isOpening c = '<' == char c

isClosing :: CharInfo -> Bool
isClosing c = '>' == char c


printPosition :: CharInfo -> String
printPosition (CharInfo _ p _) = show p

toString :: PString -> String
toString = fmap char



{- #####################################################################
 - String to tags
 -}

type RawTag = PString
type TextBuf = PString
type IntermediateRawTags = ([RawTag], TextBuf)
type IntermediateRawTagsResult = Either String IntermediateRawTags

toTags :: String -> IntermediateRawTagsResult
toTags input = foldM reduceTags ([], []) (toCharInfo input) where
  reduceTags :: IntermediateRawTags -> CharInfo -> IntermediateRawTagsResult
  reduceTags (rawTags, textBuf) c | isClosing c = createTag rawTags textBuf c
                                  | isOpening c = createNonTag rawTags textBuf c
                                  | otherwise = Right (rawTags, textBuf ++ [c])

createTag :: [RawTag] -> TextBuf -> CharInfo -> IntermediateRawTagsResult
createTag rawTags textBuf c =
  let content       = textBuf ++ [c]
      contentString = toString content
  in  if tagValid contentString
        then Right (rawTags ++ [content], [])
        else Left
          (  "Parsing error: "
          ++ "\""
          ++ [char c]
          ++ "\" at "
          ++ printPosition c
          ++ "\n"
          ++ show (line c)
          )

tagValid :: String -> Bool
tagValid tagText = head (trim tagText) == '<'

createNonTag :: [RawTag] -> TextBuf -> CharInfo -> IntermediateRawTagsResult
createNonTag rawTags textBuf c = Right (rawTags ++ [textBuf], [c])

trim :: String -> String
trim = f . f where f = reverse . dropWhile isSpace