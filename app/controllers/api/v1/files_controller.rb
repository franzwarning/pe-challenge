class Api::V1::FilesController < ApiBaseController
  include SupabaseHelper

  # Generates a presigned URL for the file upload
  def presigned_url
    file = UserFile.new(
      file_name: normalized_filename,
      mime_type: presigned_url_params[:mime_type],
      file_size_bytes: presigned_url_params[:file_size_bytes]
    )
    file.anonymous_users_id = @anonymous_user.id

    extension = file.file_name.split(".").last
    file.bucket_path = "#{SecureRandom.uuid}.#{extension}"

    response = supabase_request(
      path: "/storage/v1/object/upload/sign/user_files/#{file.bucket_path}",
      method: :post
    )
    file.extension = extension
    file.presigned_upload_url = response["url"]
    file.save!
    render json: file, serializer: UserFileSerializer, anonymous_user: @anonymous_user
  end

  # Never actually ended up using this but keeping just in case
  def update
    file = UserFile.find(params[:id])
    file.update!(update_params)
    render json: file, serializer: UserFileSerializer, anonymous_user: @anonymous_user
  end

  private

  def update_params
    params.permit(:file_name, :description, :price_usd)
  end

  def normalized_filename
    params[:file_name].gsub(/[^0-9A-Za-z.\-]/, "_")
  end

  def presigned_url_params
    params.permit(:file_name, :mime_type, :file_size_bytes)
  end
end
