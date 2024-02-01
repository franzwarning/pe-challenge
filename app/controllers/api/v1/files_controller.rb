class Api::V1::FilesController < ApiBaseController
  include SupabaseHelper

  def presigned_url
    file = UserFile.new(
      file_name: normalized_filename,
      mime_type: presigned_url_params[:mime_type]
    )
    file.anonymous_users_id = @anonymous_user.id

    extension = file.file_name.split(".").last
    file.bucket_path = "#{SecureRandom.uuid}.#{extension}"

    response = supabase_request(
      path: "/storage/v1/object/upload/sign/user_files/#{file.bucket_path}",
      method: :post
    )
    file.presigned_upload_url = response["url"]
    file.save!
    render json: file
    print("end")
  end

  private

  def normalized_filename
    params[:file_name].gsub(/[^0-9A-Za-z.\-]/, "_")
  end

  def presigned_url_params
    params.permit(:file_name, :mime_type)
  end
end
