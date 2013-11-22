class Request < ActiveRecord::Base
  validates :text,
    presence: true,
    length: { maximum: 501 }
end
