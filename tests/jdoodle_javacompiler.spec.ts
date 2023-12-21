const { test, expect } = require('@playwright/test');

let webcontext;
let page;

test.beforeAll(async ({ browser }) => {
  webcontext = await browser.newContext();
  await webcontext.addCookies([
    { name: "SESSION", value: "901e360d-82ac-4456-99b6-ec441bdfb7f0", domain: "www.jdoodle.com", path: "/" }
  ]);

  page = await webcontext.newPage();
  await page.goto('https://www.jdoodle.com/online-java-compiler');
})

// test('Login', async ({ page }) => {
//   await page.goto('https://www.jdoodle.com');
//   await page.getByText(' Login ').nth(1).click();
//   await page.locator('[type="email"]').nth(0).fill("vardini2394@gmail.com");
//   await page.locator('#login_pwd').fill('t9j39HpBxm@tZrA');
//   await page.locator('[type="submit"]').nth(0).click();
//   await page.getByText("Start Coding").nth(0).click();
// });


test('Verify Page Title', async () => {
  await expect(page.getByText('Online Java Compiler IDE')).toBeVisible();
  await expect(page.getByText(' For Multiple Files, Custom Library and File Read/Write, use our new')).toBeVisible();

});

test('Create a new Project', async () => {
  const code_input = page.locator('textarea[class="ace_text-input"]').nth(0);
  const execute = page.locator('[data-icon="play"]');
  let input_data: string = `public class MyClass {
      public static void main(String args[]) {
        int x=15;
        int y=25;
        int z=x+y;

        System.out.println("Sum of x+y = " + z);
            }
        }`;

  await page.locator('svg[data-icon="file"]').click();
  await page.getByText('New Project').nth(0).click();
  await expect(page.getByText('Do you want to clear current project?')).toBeVisible();
  await page.getByText('Yes').click();
  await page.locator("#code").click();
  await code_input.fill(input_data);
  await execute.click();
  await page.waitForTimeout(5000);
  await expect(page.locator("#output")).toContainText('Sum of x+y = 40')
});

test('Save the project', async () => {
  const save_icon = page.locator('[data-icon="floppy-disk"]');
  const projectname_input = page.locator('[id="Project NameProject Name"]').nth(0);
  const project_save = page.locator('//input[@id="Project NameProject Name"]//preceding::button[@type="submit"]').nth(3);
  const projectname = "TestProject1";

  await save_icon.click();
  await projectname_input.fill(projectname);
  await project_save.click();
});

test('Verify the project', async () => {
  const myProject_icon = page.locator('[data-icon="folder"]');

  await myProject_icon.click();
  await expect(page.getByText('TestProject1')).toBeVisible();
});

test('Verify Copy to Clipboard', async () => {
  const copytoclipboard = page.locator('[data-icon="clipboard"]');

  await copytoclipboard.click();
  await expect(page.getByText('Copied to clipboard!')).toBeVisible();
});