class UserFileSerializer < ActiveModel::Serializer
  attributes :id, :file_name, :description, :price_usd

  belongs_to :anonymous_user do
    serializer_for_anonymous_user
  end

  private

  def serializer_for_anonymous_user
    if scope.is_owner?(object.anonymous_user)
      AnonymousUserOwnerSerializer.new(object.anonymous_user, scope: scope)
    else
      BaseAnonymousUserSerializer.new(object.anonymous_user, scope: scope)
    end
  end
end
