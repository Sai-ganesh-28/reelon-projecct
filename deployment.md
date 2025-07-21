# Reelon Habit Tracker Deployment Guide

This document outlines the deployment process for the Reelon Habit Tracker application, with the frontend deployed on Firebase and the backend on Amazon EKS with custom domain mapping.

## Prerequisites

### Required Accounts
- Firebase Account
- AWS Account
- Domain Name Registration
- GitHub Repository
- Docker Hub Account

### Required Tools
- Firebase CLI: `npm install -g firebase-tools`
- AWS CLI
- kubectl
- eksctl
- Docker

## Frontend Deployment (Firebase)

### Step 1: Prepare Frontend

1. Set production API endpoint:
   ```
   REACT_APP_API_URL=https://api.yourdomain.com
   ```

2. Build the production bundle:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

### Step 2: Deploy to Firebase

1. Login and initialize Firebase:
   ```bash
   firebase login
   firebase init hosting
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

3. Frontend available at: `https://reelon.web.app`

## Backend Deployment (Amazon EKS)

### Step 1: Containerize Backend

1. Create a Dockerfile in backend directory

2. Build and push Docker image to the ecr repository in the aws 

### Step 2: Create EKS Cluster

1. Configure AWS and create cluster

2. Configure kubectl

### Step 3: Deploy to EKS

1. Create deployment and service YAML files

2. Create secrets for sensitive information these secrets are environment files which are stored in the aws secrets manager
   ```bash
   kubectl create secret generic reelon-secrets
   ```

3. Apply configurations:
   ```bash
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   ```
deployment.yaml is the deployment file where we define the number of replicas and the container image 
service.yaml is the service file where we define the load balancer and the service port

4. in the service.yaml file we get the load balancer url and we use it in the custom domain configuration

## Custom Domain Configuration

### Frontend Domain Setup

1. Add CNAME record in DNS settings:
   - Name: `www`
   - Value: `reelon.web.app`

2. Configure in Firebase console:
   - Hosting > Add custom domain

### Backend API Domain Setup

1. Get LoadBalancer DNS name from the service.yaml file pod

2. Add CNAME record:
   - Name: `api`
   - Value: [LoadBalancer DNS name]

3. Set up SSL with AWS Certificate Manager
