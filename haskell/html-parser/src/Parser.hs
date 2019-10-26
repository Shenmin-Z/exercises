module Parser where

import           Data.List                      ( foldl' )
import           Control.Monad                  ( foldM )
import           Data.Char                      ( isSpace )

type Position = (Int, Int)
type CharInfo = (Char, (Position, String))

toCharInfo :: String -> [CharInfo]
toCharInfo input =
  let textLines = zip (lines input) [1 ..]
      withRow :: (String, Int) -> [CharInfo]
      withRow (line, row) = fmap (info line row) (lineCols line)
      lineCols line = take (length line) [1 ..]
      info line row col =
          let c        = line !! col
              charInfo = ((row, col), line)
          in  (c, charInfo)
  in  textLines >>= withRow

type RawTag = String
type TextBuf = String
type IntermediateRawTags = ([RawTag], TextBuf)
type IntermediateRawTagsResult = Either String IntermediateRawTags

toTags :: String -> IntermediateRawTagsResult
toTags = foldM reduceTags ([], []) where
  reduceTags :: IntermediateRawTags -> Char -> IntermediateRawTagsResult
  reduceTags (rawTags, textBuf) c | c == '>'  = createTag rawTags textBuf
                                  | c == '<'  = createNonTag rawTags textBuf
                                  | otherwise = Right (rawTags, textBuf ++ [c])

createTag :: [RawTag] -> TextBuf -> IntermediateRawTagsResult
createTag rawTags textBuf =
  let content = textBuf ++ ['>']
  in  if tagValid content
        then Right (rawTags ++ [content], [])
        else Left ("Invalid: " ++ content)

tagValid :: String -> Bool
tagValid tagText = head (trim tagText) == '<'

createNonTag :: [RawTag] -> TextBuf -> IntermediateRawTagsResult
createNonTag rawTags textBuf = Right (rawTags ++ [trim textBuf], "<")

trim :: String -> String
trim = f . f where f = reverse . dropWhile isSpace
