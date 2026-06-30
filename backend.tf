terraform {
  backend "s3" {
    bucket       = "victus-tf-state"
    region       = "us-east-1"
    encrypt      = true
    key          = "state/terraform.tfstate"
    use_lockfile = true
  }
}
