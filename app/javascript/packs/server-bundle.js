import ReactOnRails from 'react-on-rails'

import HomePageServer from '../bundles/pages/HomePage.server'

// This is how react_on_rails can see the Home in the browser.
ReactOnRails.register({
  HomePageServer
})
