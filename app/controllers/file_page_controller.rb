class FilePageController < ApplicationController
  before_action :file_exists
  serialization_scope :anonymous_user

  def show
    @file_page_props = {
      file: UserFileSerializer.new(file, anonymous_user: @anonymous_user)
    }

    set_meta_tags(
      title: file.file_name
    )
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
