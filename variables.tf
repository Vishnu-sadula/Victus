
variable "frontend_url" {
  type    = string
  default = "http://localhost:3000"
}

variable "mongo_uri" {
  type    = string
  default = ""
}

variable "instance_name" {
  type    = string
  default = "victus"
}

variable "public_key_path" {
  type    = string
  default = "~/.ssh/id_ed25519.pub"
}

variable "key_name" {
  type    = string
  default = "victus"
}

variable "aws_region" {

}