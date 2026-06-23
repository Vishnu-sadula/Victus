terraform {
  backend "s3" {
    bucket         = "victus-terraform-state-prod"
    key            = "state/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "victus-tflock-table"
  }
}
