class HomePageController < ApplicationController
  def index
    @home_page_props = {name: "test"}
  end
end
