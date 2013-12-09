class Key < ActiveRecord::Base

  has_many :roles, inverse_of: :keys
  has_many :sites, through: :roles

  accepts_nested_attributes_for :roles

  after_create :putz

  private
    def putz
      puts SymmetricEncryption.encrypt(self.id) #yech
    end

end
