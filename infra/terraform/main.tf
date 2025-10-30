provider "aws" {
  region = "ap-south-1"
}

# EC2 for Full Stack App
resource "aws_instance" "app_server" {
  ami           = "ami-0dee22c13ea7a9a67"
  instance_type = "t2.micro"
  key_name      = "key"
  security_groups = ["allow-web"]

  tags = {
    Name = "FullStackApp"
  }
}

# Security Group
resource "aws_security_group" "allow_web" {
  name = "allow-web"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Outputs
output "app_ip" {
  value = aws_instance.app_server.public_ip
}