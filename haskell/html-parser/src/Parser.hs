module Parser where

import           Data.List                      ( foldl' )
import           Control.Monad                  ( foldM )
import           Data.Char                      ( isSpace )
import           Debug.Trace

{- #####################################################################
 - Pre-process Steps
 -}

type Position = (Int, Int)
data CharInfo = CharInfo {
  char::Char,
  position:: Position,
  line::String
} deriving (Eq)
type PString = [CharInfo]

instance Show CharInfo  where
  show c = [char c]

toCharInfo :: String -> PString
toCharInfo input =
  let textLines = zip (addBackNewLineChar $lines input) [1 ..]
      withRow :: (String, Int) -> PString
      withRow (line, row) = fmap (info line row) (lineCols line)
      lineCols line = take (length line) [1 ..]
      info line row col = CharInfo (line !! (col - 1)) (row, col) line
  in  textLines >>= withRow

addBackNewLineChar :: [String] -> [String]
addBackNewLineChar l
  | length l >= 2
  = let front   = init l
        withNLC = fmap (++ "\n") front
    in  withNLC ++ [last l]
  | otherwise
  = l

isOpening :: CharInfo -> Bool
isOpening c | '<' /= char c = False
            | otherwise     = not $ betweenQuotes c

isClosing :: CharInfo -> Bool
isClosing c | '>' /= char c = False
            | otherwise     = not $ betweenQuotes c

betweenQuotes :: CharInfo -> Bool
betweenQuotes (CharInfo _ (_, col) text) =
  let index       = col - 1
      qIndexes    = quoteIndexes text
      quoteGroups = fmap (\i -> (qIndexes !! i, qIndexes !! (i + 1)))
                         [0, 2 .. length qIndexes - 2]
      between i (x, y) = i <= y && i >= x
  in  any (between index) quoteGroups

quoteIndexes :: String -> [Int]
quoteIndexes text = fmap snd $filter (isRealQuote text) textWithIndex where
  textWithIndex = zip text [0 ..]
  isRealQuote text (c, i) | not $isQuote c = False
                          | i == 0        = True
                          | otherwise     = '\\' /= text !! (i - 1)

isQuote :: Char -> Bool
isQuote c = c == '\'' || c == '"'

printPosition :: CharInfo -> String
printPosition (CharInfo _ (row, col) _) = ":" ++ show row ++ ":" ++ show col

printError :: CharInfo -> String
printError c =
  "Parsing error: "
    ++ "\""
    ++ [char c]
    ++ "\" at "
    ++ printPosition c
    ++ "\n"
    ++ show (line c)

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

toTags' :: String -> Either String [RawTag]
toTags' input = do
  (rawTags, textBuf) <- toTags input
  let trimmed = trim $ toString textBuf
  if null trimmed
    then return $ filter (not . null) (addTag rawTags textBuf)
    else Left (printError $ last textBuf)

createTag :: [RawTag] -> TextBuf -> CharInfo -> IntermediateRawTagsResult
createTag rawTags textBuf c =
  let content       = textBuf ++ [c]
      contentString = toString content
  in  if tagValid contentString
        then Right (addTag rawTags content, [])
        else Left (printError c)

tagValid :: String -> Bool
tagValid tagText | null trimmed = False
                 | otherwise    = hasOpening && hasClosing
 where
  trimmed    = trim tagText
  hasOpening = head trimmed == '<'
  hasClosing = last trimmed == '>'


createNonTag :: [RawTag] -> TextBuf -> CharInfo -> IntermediateRawTagsResult
createNonTag rawTags textBuf c | null trimmed        = result
                               | null rawTags        = err
                               | head trimmed == '<' = err
                               | otherwise           = result
 where
  trimmed = trim $ toString textBuf
  result  = Right (addTag rawTags textBuf, [c])
  err     = Left (printError c)

addTag :: [RawTag] -> RawTag -> [RawTag]
addTag rawTags t = rawTags ++ [t]

trim :: String -> String
trim = f . f where f = reverse . dropWhile isSpace

trimP :: PString -> PString
trimP = f . f where f = reverse . dropWhile (isSpace . char)



{- #####################################################################
 - Inside tag
 -}

isTag :: PString -> Bool
isTag s | length s < 2 = False
        | otherwise    = char (head s) == '<' && char (last s) == '>'

removeBracket :: PString -> PString
removeBracket = init . tail

isClosingTag :: PString -> Bool
isClosingTag s | null wds                    = False
               | char (head $head wds) == '/' = True
               | otherwise                   = False
  where wds = dropWhile null $pwords $ removeBracket s

type Attribute = (PString, PString)
type OpeningTag = (PString, [Attribute])
type ClosingTag = PString

parseClosing :: PString -> Either String ClosingTag
parseClosing s | length wds == 1 = Right (tail $ head wds)
               | length wds == 2 = Right (wds !! 1)
               | otherwise       = Left (printError $head (wds !! 2))
  where wds = filter (not . null) $pwords $ removeBracket s

pwords :: PString -> [PString]
pwords s = case dropWhile isSpace' s of
  [] -> []
  s' -> w : pwords s'' where (w, s'') = break isSpace' s'
  where isSpace' = isSpace . char

--parseOpening :: String -> Either String OpeningTag
--parseOpening s
  
