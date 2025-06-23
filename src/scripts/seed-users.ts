import "dotenv/config"

import { db } from "@/server/db"
import { users, companies, roles, userRoles, userCompanies } from "@/server/db/schema"
import { hash } from "bcrypt-ts"

async function seedUsers() {
  try {
    console.log("🌱 Iniciando seed de usuários...")

    // Criar empresas de exemplo
    const companiesData = [
      { companyName: "TAM Linhas Aéreas", status: 1 },
      { companyName: "Gol Linhas Aéreas", status: 1 },
      { companyName: "Azul Linhas Aéreas", status: 1 },
      { companyName: "LATAM Airlines", status: 1 },
      { companyName: "Avianca Brasil", status: 1 },
    ]

    console.log("📦 Inserindo empresas...")
    const insertedCompanies = await db.insert(companies).values(companiesData).returning()
    console.log(`✅ ${insertedCompanies.length} empresas inseridas`)

    // Criar roles de exemplo se não existirem
    const existingRoles = await db.select().from(roles)
    if (existingRoles.length === 0) {
      const rolesData = [
        { name: "Super Admin", description: "Acesso total ao sistema", status: 1 },
        { name: "Admin", description: "Administrador do sistema", status: 1 },
        { name: "Supervisor", description: "Supervisor de operações", status: 1 },
        { name: "Operador", description: "Operador de rampa", status: 1 },
        { name: "Visualizador", description: "Apenas visualização", status: 1 },
      ]

      console.log("🔐 Inserindo roles...")
      const insertedRoles = await db.insert(roles).values(rolesData).returning()
      console.log(`✅ ${insertedRoles.length} roles inseridas`)
    }

    // Buscar roles para associar aos usuários
    const allRoles = await db.select().from(roles)
    const superAdminRole = allRoles.find((r) => r.name === "Super Admin")
    const adminRole = allRoles.find((r) => r.name === "Admin")
    const supervisorRole = allRoles.find((r) => r.name === "Supervisor")
    const operadorRole = allRoles.find((r) => r.name === "Operador")

    // Criar usuários de exemplo
    const hashedPassword = "123456"

    const usersData = [
      {
        fullName: "Davi Holanda",
        email: "davi.holanda.23@gmail.com",
        enrollmentNumber: "DEV001",
        passwordHash: hashedPassword,
        status: 1,
      },
      {
        fullName: "João Silva Santos",
        email: "joao.silva@email.com",
        enrollmentNumber: "EMP001",
        passwordHash: hashedPassword,
        status: 1,
      },
      {
        fullName: "Maria Costa Oliveira",
        email: "maria.costa@email.com",
        enrollmentNumber: "EMP002",
        passwordHash: hashedPassword,
        status: 1,
      },
      {
        fullName: "Pedro Lima",
        email: "pedro.lima@email.com",
        enrollmentNumber: "EMP003",
        passwordHash: hashedPassword,
        status: 0,
      },
      {
        fullName: "Ana Santos",
        email: "ana.santos@email.com",
        enrollmentNumber: "EMP004",
        passwordHash: hashedPassword,
        status: 1,
      },
      {
        fullName: "Carlos Ferreira",
        email: "carlos.ferreira@email.com",
        enrollmentNumber: "EMP005",
        passwordHash: hashedPassword,
        status: 1,
      },
    ]

    console.log("👥 Inserindo usuários...")
    const insertedUsers = await db.insert(users).values(usersData).returning()
    console.log(`✅ ${insertedUsers.length} usuários inseridos`)

    // Associar usuários a roles
    const userRolesData = []

    // Davi como Super Admin
    const daviUser = insertedUsers.find((u) => u.email === "davi.holanda.23@gmail.com")
    if (daviUser && superAdminRole) {
      userRolesData.push({
        userId: daviUser.userId,
        roleId: superAdminRole.roleId,
        companyId: null, // Role global
        status: 1,
      })
    }

    // João como Admin na TAM
    const joaoUser = insertedUsers.find((u) => u.email === "joao.silva@email.com")
    const tamCompany = insertedCompanies.find((c) => c.companyName === "TAM Linhas Aéreas")
    if (joaoUser && adminRole && tamCompany) {
      userRolesData.push({
        userId: joaoUser.userId,
        roleId: adminRole.roleId,
        companyId: tamCompany.companyId,
        status: 1,
      })
    }

    // Maria como Supervisor na Azul
    const mariaUser = insertedUsers.find((u) => u.email === "maria.costa@email.com")
    const azulCompany = insertedCompanies.find((c) => c.companyName === "Azul Linhas Aéreas")
    if (mariaUser && supervisorRole && azulCompany) {
      userRolesData.push({
        userId: mariaUser.userId,
        roleId: supervisorRole.roleId,
        companyId: azulCompany.companyId,
        status: 1,
      })
    }

    // Pedro como Operador na LATAM
    const pedroUser = insertedUsers.find((u) => u.email === "pedro.lima@email.com")
    const latamCompany = insertedCompanies.find((c) => c.companyName === "LATAM Airlines")
    if (pedroUser && operadorRole && latamCompany) {
      userRolesData.push({
        userId: pedroUser.userId,
        roleId: operadorRole.roleId,
        companyId: latamCompany.companyId,
        status: 1,
      })
    }

    if (userRolesData.length > 0) {
      console.log("🔗 Associando usuários a roles...")
      await db.insert(userRoles).values(userRolesData)
      console.log(`✅ ${userRolesData.length} associações de roles criadas`)
    }

    // Associar usuários a empresas
    const userCompaniesData = []

    // João na TAM e Gol
    const golCompany = insertedCompanies.find((c) => c.companyName === "Gol Linhas Aéreas")
    if (joaoUser && tamCompany) {
      userCompaniesData.push({ userId: joaoUser.userId, companyId: tamCompany.companyId, role: 1, status: 1 })
    }
    if (joaoUser && golCompany) {
      userCompaniesData.push({ userId: joaoUser.userId, companyId: golCompany.companyId, role: 1, status: 1 })
    }

    // Maria na Azul
    if (mariaUser && azulCompany) {
      userCompaniesData.push({ userId: mariaUser.userId, companyId: azulCompany.companyId, role: 1, status: 1 })
    }

    // Pedro na LATAM
    if (pedroUser && latamCompany) {
      userCompaniesData.push({ userId: pedroUser.userId, companyId: latamCompany.companyId, role: 1, status: 1 })
    }

    if (userCompaniesData.length > 0) {
      console.log("🏢 Associando usuários a empresas...")
      await db.insert(userCompanies).values(userCompaniesData)
      console.log(`✅ ${userCompaniesData.length} associações de empresas criadas`)
    }

    console.log("🎉 Seed de usuários concluído com sucesso!")
    console.log("\n📋 Resumo:")
    console.log(`- ${insertedCompanies.length} empresas criadas`)
    console.log(`- ${insertedUsers.length} usuários criados`)
    console.log(`- ${userRolesData.length} associações de roles`)
    console.log(`- ${userCompaniesData.length} associações de empresas`)
    console.log("\n🔑 Credenciais de acesso:")
    console.log("Email: davi.holanda.23@gmail.com")
    console.log("Senha: 123456")
    console.log("Role: Super Admin")
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error)
    throw error
  }
}

// Executar o seed
seedUsers()
  .then(() => {
    console.log("✅ Processo finalizado")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Erro:", error)
    process.exit(1)
  })
