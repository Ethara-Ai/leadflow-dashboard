# CI/CD Setup Guide

This document provides instructions for setting up the CI/CD pipelines for the Zoolab Dashboard project using GitHub Actions and AWS S3.

## Overview

The CI/CD pipeline consists of three workflows:

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI | `ci.yml` | Push/PR to `main` or `develop` | Lint, test, and build validation |
| Deploy Production | `deploy.yml` | Push to `main` or manual | Deploy to production S3 bucket |
| Deploy Staging | `deploy-staging.yml` | Push to `develop` or manual | Deploy to staging S3 bucket |

## Prerequisites

1. **AWS Account** with an S3 bucket configured for static website hosting
2. **IAM User** with programmatic access for S3 deployments
3. **GitHub Repository** with Actions enabled

## AWS Setup

### 1. Create S3 Buckets

Create two S3 buckets for production and staging:

```bash
# Production bucket
aws s3 mb s3://your-production-bucket-name

# Staging bucket
aws s3 mb s3://your-staging-bucket-name
```

### 2. Configure Static Website Hosting

For each bucket, enable static website hosting:

```bash
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html
```

### 3. Set Bucket Policy

Apply a public access policy (or CloudFront OAI policy if using CloudFront):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 4. Create IAM User for Deployments

Create an IAM user with the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-production-bucket-name",
        "arn:aws:s3:::your-production-bucket-name/*",
        "arn:aws:s3:::your-staging-bucket-name",
        "arn:aws:s3:::your-staging-bucket-name/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

### 5. (Optional) Set Up CloudFront

For better performance and HTTPS support, create CloudFront distributions:

1. Create a distribution pointing to your S3 bucket
2. Configure the origin with the S3 website endpoint
3. Set up SSL certificate (ACM)
4. Configure cache behaviors

## GitHub Configuration

### Required Secrets

Navigate to **Settings → Secrets and variables → Actions → Secrets** and add:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | IAM user access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `S3_BUCKET_NAME` | Production S3 bucket name | `zoolab-dashboard-prod` |
| `S3_BUCKET_NAME_STAGING` | Staging S3 bucket name | `zoolab-dashboard-staging` |

### Optional Variables

Navigate to **Settings → Secrets and variables → Actions → Variables** and add:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `AWS_REGION` | AWS region for deployment | `us-east-1` |
| `CLOUDFRONT_DISTRIBUTION_ID` | Production CloudFront distribution ID | `E1ABCDEFGHIJK` |
| `CLOUDFRONT_DISTRIBUTION_ID_STAGING` | Staging CloudFront distribution ID | `E2LMNOPQRSTUV` |
| `CLOUDFRONT_URL` | Production CloudFront URL | `https://d1234.cloudfront.net` |
| `S3_WEBSITE_URL` | Production S3 website URL | `http://bucket.s3-website.region.amazonaws.com` |
| `STAGING_URL` | Staging environment URL | `https://staging.example.com` |

### Environment Protection Rules (Recommended)

For added security, configure environment protection rules:

1. Go to **Settings → Environments**
2. Create `production` and `staging` environments
3. For `production`, add:
   - Required reviewers (optional)
   - Wait timer (optional)
   - Deployment branches: `main` only

## Workflow Details

### CI Workflow (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches:

1. **Lint Job**: Runs ESLint to check code quality
2. **Test Job**: Runs Vitest tests with coverage
3. **Build Job**: Builds the project (runs after lint and test pass)

### Production Deployment (`deploy.yml`)

Triggered on:
- Push to `main` branch
- Manual trigger via `workflow_dispatch`

Steps:
1. Runs tests and linting
2. Builds the project
3. Syncs build artifacts to S3 with proper cache headers
4. Invalidates CloudFront cache (if configured)

### Staging Deployment (`deploy-staging.yml`)

Triggered on:
- Push to `develop` branch
- Manual trigger with option to skip tests

Steps:
1. Runs tests (optional skip)
2. Builds with staging environment variables
3. Deploys to staging S3 bucket
4. Invalidates staging CloudFront cache (if configured)

## Manual Deployment

To manually trigger a deployment:

1. Go to **Actions** tab in GitHub
2. Select the desired workflow
3. Click **Run workflow**
4. Select the branch and options
5. Click **Run workflow**

## Cache Strategy

The deployment uses an optimized cache strategy:

| File Type | Cache-Control Header |
|-----------|---------------------|
| Static assets (JS, CSS, images) | `public, max-age=31536000, immutable` |
| `index.html` | `no-cache, no-store, must-revalidate` |
| JSON files | `no-cache, no-store, must-revalidate` |

This ensures:
- Static assets are cached for 1 year (they have hashed filenames from Vite)
- HTML/JSON files are always fresh to ensure users get the latest version

## Troubleshooting

### Common Issues

**1. Access Denied errors**
- Verify IAM user has correct permissions
- Check bucket policy allows the operations
- Ensure secrets are correctly configured

**2. CloudFront invalidation fails**
- Verify `CLOUDFRONT_DISTRIBUTION_ID` is correct
- Check IAM user has `cloudfront:CreateInvalidation` permission

**3. Build fails**
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Review build logs for specific errors

### Viewing Workflow Runs

1. Go to **Actions** tab
2. Click on the workflow run to see details
3. Expand individual steps to see logs
4. Check the **Summary** for deployment information

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use GitHub Secrets** for all sensitive values
3. **Enable branch protection** on `main` and `develop`
4. **Require PR reviews** before merging to `main`
5. **Use environment protection** for production deployments
6. **Rotate AWS credentials** periodically
7. **Use least-privilege IAM policies**

## Support

If you encounter issues:

1. Check the workflow run logs in GitHub Actions
2. Verify all secrets and variables are configured
3. Test AWS credentials locally with AWS CLI
4. Review the S3 bucket permissions and policies