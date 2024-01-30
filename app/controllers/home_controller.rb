class HomeController < ApplicationController
    def index
      @home_props = { name: 'test'}
    end
end