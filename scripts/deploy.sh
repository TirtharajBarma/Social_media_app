#!/bin/bash

echo "🚀 Deploying..."

# Check if secrets file exists
if [ ! -f "infra/ansible/secrets.yml" ]; then
    echo "❌ Error: secrets.yml not found!"
    echo "Copy infra/ansible/secrets.yml.example to secrets.yml and fill with your values"
    exit 1
fi

# 1. Terraform
cd infra/terraform
terraform init
terraform apply -auto-approve
EC2_IP=$(terraform output -raw app_ip)

# 2. Ansible
cd ../ansible
sed -i "s/YOUR_EC2_IP/$EC2_IP/g" inventory.yml
sleep 60

ansible-playbook -i inventory.yml playbook.yml --private-key ~/.ssh/key.pem

echo "✅ Done! App at: http://$EC2_IP"