{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE FlexibleContexts           #-}
{-# LANGUAGE FlexibleInstances          #-}
{-# LANGUAGE GADTs                      #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE MultiParamTypeClasses      #-}
{-# LANGUAGE QuasiQuotes                #-}
{-# LANGUAGE TemplateHaskell            #-}
{-# LANGUAGE TypeFamilies               #-}

import Web.Spock hiding (head)
import Web.Spock.Config
import Control.Arrow ((>>>))
import Data.Text hiding (map, head)

import Data.Aeson hiding (json)
import Data.Monoid ((<>))
import Data.Text (Text, pack)
import GHC.Generics
import Control.Monad.IO.Class (liftIO)

import Control.Monad (mapM, forM)
import Control.Monad.Logger (LoggingT, runStdoutLoggingT)
import Database.Persist hiding (get)
import qualified Database.Persist as P
import Database.Persist.Sqlite hiding (get)
import Database.Persist.TH

import Web.Spock.Lucid (lucid)
import Lucid

share [mkPersist sqlSettings, mkMigrate "migrateAll"] [persistLowerCase|
Story json
  body Text
  tags Text
  deriving Show
|]

type Api = SpockM SqlBackend () () ()

type ApiAction a = SpockAction SqlBackend () () a

main :: IO ()
main = do
  pool <- runStdoutLoggingT $ createSqlitePool "api.db" 5
  spockCfg <- defaultSpockCfg () (PCPool pool) ()
  runStdoutLoggingT $ runSqlPool (do runMigration migrateAll) pool
  runSpock 8080 (spock spockCfg app)

app :: Api
app = do
  get "stories" $ do
    stories <- runSQL $ selectList [] [Asc StoryId]
    json stories
  get ("people" <//> var) $ \personId -> do
    maybeStory <- runSQL $ P.get personId :: ApiAction (Maybe Story)
    case maybeStory of
      Nothing -> errorJson 404 "Could not find a person with matching id"
      Just theStory -> json theStory
  get "admin" $ do
    stories <- runSQL $ selectList [] [Asc StoryId] 
    let st = map (toHtml . storyBody . entityVal) stories
    liftIO $ print st
    lucid $ do
        h1_ "Admin panel" 
        mapM p_ st
        div_ (
          form_ [method_ "post", action_ "/story"] $ do
            label_ $ do
              "Prica:"
              textarea_ [name_ "story"] ""
            label_ $ do
              "Tagovi:"
              input_ [name_ "tags"]
            input_ [type_ "submit", value_ "Ovjekovechi"]
          )
  post "story" $ do
    story <- param' "story"
    tags <- param' "tags"
    newId <- runSQL $ insert (Story story tags)
    redirect "/admin"

errorJson :: Int -> Text -> ApiAction ()
errorJson code message =
  json $
    object
    [ "result" .= String "failure"
    , "error" .= object ["code" .= code, "message" .= message]
    ]

runSQL
  :: (HasSpock m, SpockConn m ~ SqlBackend)
  => SqlPersistT (LoggingT IO) a -> m a
runSQL action = runQuery $ \conn -> runStdoutLoggingT $ runSqlConn action conn
