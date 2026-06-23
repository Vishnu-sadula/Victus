terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region     = var.aws_region
  access_key = var.access_key
  secret_key = var.secret_key
  

}

resource "aws_instance" "zapier" {
  ami                    = "ami-0ec10929233384c7f"
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.zapier.key_name
  vpc_security_group_ids = ["sg-02a83ab53fe1a45c6"]

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # 1. Update and install dependencies
              apt-get update -y
              apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release git fontconfig openjdk-21-jre

              # Install Docker
              install -m0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              chmod a+r /etc/apt/keyrings/docker.gpg
              
              # Use $$ to escape Terraform interpolation
              echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $$(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
              
              apt-get update -y
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
              systemctl enable --now docker
              usermod -aG docker ubuntu


              # Install Jenkins
              wget -O /etc/apt/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
              echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | tee /etc/apt/sources.list.d/jenkins.list > /dev/null
              apt-get update -y
              apt-get install -y jenkins
              sudo usermod -aG docker jenkins
              sudo systemctl restart jenkins
              systemctl enable jenkins

              

              EOF

  tags = { Name = var.instance_name }
}

resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "zapier_pem" {
  content         = tls_private_key.ssh_key.private_key_pem
  filename = "zapier.pem"
  file_permission = "0600"
}

resource "aws_key_pair" "zapier" {
  key_name   = "zapier"
  public_key = tls_private_key.ssh_key.public_key_openssh
}
