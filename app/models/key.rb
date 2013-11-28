class Key < ActiveRecord::Base
  belongs_to :site
  after_create :putz

  validates :role,
    presence: true,
    inclusion: { in: %w(basic council),
      message: "%{value} not a valid role." }

  private
    def putz
      puts SymmetricEncryption.encrypt(self.id) #yech
    end
end
