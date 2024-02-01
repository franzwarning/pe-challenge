class BaseAnonymousUserSerializer < ActiveModel::Serializer
  attributes :id, :uuid # Add other fields that are always included
end

class OwnerAnonymousUserSerializer < BaseAnonymousUserSerializer
end
