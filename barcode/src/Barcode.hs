module Barcode where

import           Data.Array                     ( Array(..)
                                                , (!)
                                                , bounds
                                                , elems
                                                , indices
                                                , ixmap
                                                , listArray
                                                )

import           Control.Monad                  ( forM_ )
import           Data.Char                      ( digitToInt )
import           Data.Ix                        ( Ix(..) )
import           Data.List                      ( foldl'
                                                , group
                                                , sort
                                                , sortBy
                                                , tails
                                                )
import           Data.Maybe                     ( catMaybes
                                                , listToMaybe
                                                )
import           Data.Ratio                     ( Ratio )
import           Data.Word                      ( Word8 )
import           System.Environment             ( getArgs )
import qualified Data.ByteString.Lazy.Char8    as L
import qualified Data.Map                      as M

import           Parse

checkDigit :: (Integral a) => [a] -> a
checkDigit ds = 10 - (sum products `mod` 10)
  where products = mapEveryOther (* 3) (reverse ds)

mapEveryOther :: (a -> a) -> [a] -> [a]
mapEveryOther f = zipWith ($) (cycle [f, id])

leftOddList =
  [ "0001101"
  , "0011001"
  , "0010011"
  , "0111101"
  , "0100011"
  , "0110001"
  , "0101111"
  , "0111011"
  , "0110111"
  , "0001011"
  ]

rightList = map complement <$> leftOddList
 where
  complement '0' = '1'
  complement '1' = '0'

leftEvenList = map reverse rightList

parityList =
  [ "111111"
  , "110100"
  , "110010"
  , "110001"
  , "101100"
  , "100110"
  , "100011"
  , "101010"
  , "101001"
  , "100101"
  ]

listToArray :: [a] -> Array Int a
listToArray xs = listArray (0, l - 1) xs where l = length xs
