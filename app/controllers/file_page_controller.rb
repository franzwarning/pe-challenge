class FilePageController < ApplicationController
  before_action :file_exists

  def show
    @file_page_props = {
      file: UserFileSerializer.new(file, scope: @anonymous_user)
    }
  end

  private

  def file_exists
    if file.nil?
      render file: "#{Rails.root}/public/404.html", status: :not_found, layout: false
    end
  end

  def file
    @file ||= UserFile.find_by(id: params[:id])
  end
end
